import 'server-only';

import {
  and,
  count,
  desc,
  eq,
  gte,
  inArray,
  isNull,
  or,
  sql,
} from 'drizzle-orm';
import { z } from 'zod';

import {
  communityReportInput,
  compatibilityEvidenceInput,
  compatibilityRelationshipInput,
} from '@/features/workspaces/schemas/compatibility-input';
import {
  COMMUNITY_MAX_AGE_MS,
  COMPATIBILITY_ENGINE_VERSION,
  resolveCompatibility,
} from '@/features/workspaces/services/compatibility-engine';
import { WorkspaceError } from '@/features/workspaces/services/workspace-policy';
import { createWorkspaceService } from '@/features/workspaces/services/workspace-service';
import { hasPermission } from '@/lib/auth/helpers/permissions';
import {
  catalogAuditTable as audit,
  compatibilityCacheTable as cache,
  stackChangeTable as change,
  compatibilityCommunityTable as community,
  stackEntryTable as entry,
  compatibilityEvidenceTable as evidence,
  catalogProjectTable as project,
  compatibilityRelationshipTable as relation,
  compatibilityRevisionTable as revision,
  catalogSourceTable as source,
  userTable as user,
  catalogVersionTable as version,
} from '@/lib/db/schema';

import type {
  CompatibilitySnapshot,
  EvidenceClaim,
} from '@/features/workspaces/schemas/compatibility-types';
import type { WorkspaceDatabase } from '@/features/workspaces/services/workspace-service';

const uuid = z.string().uuid();
const day = 86400000;
export function createCompatibilityService(
  db: WorkspaceDatabase,
  engine = resolveCompatibility,
) {
  type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];
  const workspaces = createWorkspaceService(db);
  async function curator(tx: Tx, actor: string) {
    const [u] = await tx.select().from(user).where(eq(user.id, actor));
    if (!u || u.banned || !hasPermission(u.role, 'catalog:curate'))
      throw new WorkspaceError(
        'Catalog curation permission required.',
        'forbidden',
      );
  }
  async function catalogLock(tx: Tx) {
    await tx.execute(sql`SELECT pg_advisory_xact_lock(72721402)`);
  }
  function dates(input: { observedAt: Date; expiresAt: Date }, now: Date) {
    if (
      input.observedAt > now ||
      input.expiresAt <= now ||
      input.expiresAt <= input.observedAt ||
      input.expiresAt.getTime() - input.observedAt.getTime() > 365 * day
    )
      throw new WorkspaceError(
        'Use an observation date in the past and a future expiry within one year of observation.',
      );
  }
  async function release(tx: Tx, id: string) {
    const [record] = await tx
      .select({ version, source })
      .from(version)
      .innerJoin(source, eq(version.sourceId, source.id))
      .where(eq(version.id, uuid.parse(id)));
    if (!record) throw new WorkspaceError('Catalog release not found.');
    return record;
  }
  async function loadSnapshot(
    tx: Tx,
    workspaceId: string,
    runtime: { platform: string; minecraftVersion: string },
    now: Date,
  ): Promise<CompatibilitySnapshot> {
    const rows = await tx
      .select({ entry, project, version, source })
      .from(entry)
      .innerJoin(project, eq(entry.projectId, project.id))
      .leftJoin(version, eq(entry.versionId, version.id))
      .leftJoin(source, eq(version.sourceId, source.id))
      .where(eq(entry.workspaceId, workspaceId))
      .orderBy(entry.id)
      .limit(1001);
    if (rows.length > 1000) throw new Error('Stack exceeds computation limit');
    const versionIds = rows.flatMap((r) => (r.version ? [r.version.id] : []));
    const projectIds = rows.map((r) => r.project.id);
    const relationships =
      projectIds.length ?
        await tx
          .select()
          .from(relation)
          .where(
            and(
              inArray(relation.fromProjectId, projectIds),
              isNull(relation.revokedAt),
            ),
          )
          .orderBy(relation.id)
          .limit(10001)
      : [];
    if (relationships.length > 10000)
      throw new Error('Relationship computation limit');
    const claims =
      versionIds.length ?
        await tx
          .select()
          .from(evidence)
          .where(
            and(
              inArray(evidence.versionId, versionIds),
              eq(evidence.platform, runtime.platform),
              eq(evidence.minecraftVersion, runtime.minecraftVersion),
            ),
          )
          .orderBy(evidence.id)
          .limit(10001)
      : [];
    if (claims.length > 10000) throw new Error('Evidence computation limit');
    // Review and account trust are evaluated afresh after revision invalidation.
    const reports =
      versionIds.length ?
        await tx
          .select({
            report: community,
            banned: user.banned,
            accountCreatedAt: user.createdAt,
          })
          .from(community)
          .innerJoin(user, eq(community.userId, user.id))
          .where(
            and(
              inArray(community.versionId, versionIds),
              eq(community.platform, runtime.platform),
              eq(community.minecraftVersion, runtime.minecraftVersion),
              eq(community.status, 'approved'),
              gte(
                community.observedAt,
                new Date(now.getTime() - COMMUNITY_MAX_AGE_MS),
              ),
            ),
          )
          .orderBy(community.id)
          .limit(10001)
      : [];
    if (reports.length > 10000) throw new Error('Community computation limit');
    const depProjects = rows.flatMap(
      (r) =>
        r.version?.dependencies.flatMap((d) =>
          d.sourceProjectId ? [d.sourceProjectId] : [],
        ) ?? [],
    );
    const depVersions = rows.flatMap(
      (r) =>
        r.version?.dependencies.flatMap((d) =>
          d.sourceVersionId ? [d.sourceVersionId] : [],
        ) ?? [],
    );
    const relatedProjects = [
      ...new Set([...projectIds, ...relationships.map((r) => r.toProjectId)]),
    ];
    const relatedVersions = relationships.flatMap((r) =>
      r.toVersionId ? [r.toVersionId] : [],
    );
    const identities =
      relatedProjects.length || depProjects.length ?
        await tx
          .select({
            provider: source.provider,
            externalId: source.externalId,
            projectId: source.projectId,
            name: project.name,
            url: source.url,
          })
          .from(source)
          .innerJoin(project, eq(source.projectId, project.id))
          .where(
            or(
              relatedProjects.length ?
                inArray(source.projectId, relatedProjects)
              : undefined,
              depProjects.length ?
                inArray(source.externalId, depProjects)
              : undefined,
            ),
          )
      : [];
    const releaseIdentities =
      relatedVersions.length || depVersions.length ?
        await tx
          .select({
            provider: source.provider,
            externalId: version.externalId,
            projectId: source.projectId,
            name: project.name,
            url: version.url,
            versionId: version.id,
          })
          .from(version)
          .innerJoin(source, eq(version.sourceId, source.id))
          .innerJoin(project, eq(source.projectId, project.id))
          .where(
            or(
              relatedVersions.length ?
                inArray(version.id, relatedVersions)
              : undefined,
              depVersions.length ?
                inArray(version.externalId, depVersions)
              : undefined,
            ),
          )
      : [];
    return {
      ...runtime,
      projects: identities,
      versions: releaseIdentities,
      relationships: relationships.map((r) => ({
        ...r,
        observedAt: r.observedAt.toISOString(),
        expiresAt: r.expiresAt.toISOString(),
      })),
      entries: rows.map((r) => {
        const communityClaims: EvidenceClaim[] = [];
        for (const result of ['compatible', 'incompatible'] as const) {
          const eligible = reports.filter(
            (p) =>
              p.report.versionId === r.version?.id &&
              p.report.result === result &&
              !p.banned &&
              p.report.observedAt <= now &&
              p.report.reviewerId !== null &&
              p.report.reviewerId !== p.report.userId &&
              p.report.reviewedAt !== null &&
              p.accountCreatedAt.getTime() <= now.getTime() - 7 * day,
          );
          // Counts are independently reviewed unique account/target rows, never raw votes.
          if (eligible.length >= 3) {
            const oldest = Math.min(
              ...eligible.map((p) => p.report.observedAt.getTime()),
            );
            communityClaims.push({
              id: `community:${r.version!.id}:${result}`,
              kind: 'community-tested',
              result,
              confidence: 'medium',
              provenance: `${eligible.length} independently reviewed community reports`,
              url: null,
              observedAt: new Date(oldest).toISOString(),
              expiresAt: new Date(oldest + COMMUNITY_MAX_AGE_MS).toISOString(),
              eligible: true,
              detail:
                'At least three distinct, non-banned accounts aged seven days or more; each opted in and passed curator review. Oldest observation shown. This evidence never silently overrides publisher metadata.',
            });
          }
        }
        return {
          id: r.entry.id,
          projectId: r.project.id,
          name: r.project.name,
          slug: r.project.slug,
          enabled: r.entry.enabled,
          versionId: r.entry.versionId,
          versionName: r.version?.name ?? r.entry.manualVersion,
          versionNumber: r.version?.versionNumber ?? r.entry.manualVersion,
          provider: r.source?.provider ?? null,
          sourceUrl: r.version?.url ?? null,
          sourceSyncedAt: r.source?.lastSyncedAt?.toISOString() ?? null,
          sourceStatus: r.source?.status ?? null,
          available: r.version?.available === 1,
          support: r.version?.support ?? [],
          dependencies: r.version?.dependencies ?? [],
          evidence: [
            ...claims
              .filter((c) => c.versionId === r.version?.id)
              .map((c) => ({
                id: c.id,
                kind: c.kind,
                result: c.result,
                confidence: c.confidence,
                provenance: c.provenance,
                url: c.url,
                observedAt: c.observedAt.toISOString(),
                expiresAt: c.expiresAt.toISOString(),
                eligible: !c.revokedAt,
                detail:
                  c.revokedAt ?
                    'Revoked evidence, retained for provenance; excluded from the verdict.'
                  : 'Curator-recorded evidence; follow the provenance link for the underlying observation.',
              })),
            ...communityClaims,
          ],
        };
      }),
    };
  }
  return {
    async report(actor: string, workspaceId: string, force = false) {
      // Authorization failures never write failure state or disclose a cached report.
      await workspaces.authorize(
        db,
        actor,
        workspaceId,
        force ? 'content' : 'read',
      );
      let attemptedFingerprint = 'failed';
      try {
        return await db.transaction(
          async (tx) => {
            await tx.execute(
              sql`SELECT pg_advisory_xact_lock(hashtextextended(${`compat:${workspaceId}`}, 0))`,
            );
            const runtime = await workspaces.authorize(
              tx,
              actor,
              workspaceId,
              force ? 'content' : 'read',
            );
            const revisions = await tx
              .select()
              .from(revision)
              .where(
                inArray(revision.scope, [
                  'catalog',
                  `workspace:${workspaceId}`,
                ]),
              )
              .orderBy(revision.scope);
            const fingerprint = JSON.stringify([
              COMPATIBILITY_ENGINE_VERSION,
              runtime.platform,
              runtime.minecraftVersion,
              revisions,
            ]);
            attemptedFingerprint = fingerprint;
            const now = new Date();
            const [previous] = await tx
              .select()
              .from(cache)
              .where(eq(cache.workspaceId, workspaceId));
            if (
              !force &&
              previous?.fingerprint === fingerprint &&
              previous.expiresAt > now
            )
              return { ...previous, cached: true };
            const snapshot = await loadSnapshot(tx, workspaceId, runtime, now);
            const report = engine(snapshot, now);
            const boundaries = [
              ...report.entries.flatMap((e) =>
                e.evidence.map((c) => new Date(c.expiresAt).getTime()),
              ),
              ...snapshot.relationships.map((r) =>
                new Date(r.expiresAt).getTime(),
              ),
            ].filter((t) => t > now.getTime());
            const values = {
              workspaceId,
              fingerprint,
              report,
              computedAt: now,
              expiresAt: new Date(
                Math.min(now.getTime() + 3600000, ...boundaries),
              ),
              error: null,
            };
            await tx
              .insert(cache)
              .values(values)
              .onConflictDoUpdate({ target: cache.workspaceId, set: values });
            await tx
              .update(change)
              .set({ processedAt: now })
              .where(
                and(
                  eq(change.workspaceId, workspaceId),
                  isNull(change.processedAt),
                ),
              );
            return { ...values, cached: false };
          },
          { isolationLevel: 'repeatable read' },
        );
      } catch (error) {
        if (error instanceof WorkspaceError || error instanceof z.ZodError)
          throw error;
        console.error(
          'Compatibility recompute failed; check the compatibility operations page.',
        );
        const now = new Date();
        const failure = {
          workspaceId,
          fingerprint: attemptedFingerprint,
          report: null,
          computedAt: now,
          expiresAt: new Date(now.getTime() + 30000),
          error:
            'Compatibility could not be recomputed. No previous verdict is being presented as current. Retry or contact an administrator.',
        };
        await db
          .insert(cache)
          .values(failure)
          .onConflictDoUpdate({ target: cache.workspaceId, set: failure });
        return { ...failure, cached: false };
      }
    },
    async addEvidence(actor: string, input: unknown) {
      const values = compatibilityEvidenceInput.parse(input);
      dates(values, new Date());
      return db.transaction(async (tx) => {
        await curator(tx, actor);
        await catalogLock(tx);
        const selected = await release(tx, values.versionId);
        const [record] = await tx
          .insert(evidence)
          .values({ ...values, actorId: actor })
          .returning();
        await tx.insert(audit).values({
          actorId: actor,
          projectId: selected.source.projectId,
          event: 'compatibility_evidence_added',
          detail: { evidenceId: record.id, ...values },
        });
        return record;
      });
    },
    async addRelationship(actor: string, input: unknown) {
      const values = compatibilityRelationshipInput.parse(input);
      dates(values, new Date());
      return db.transaction(async (tx) => {
        await curator(tx, actor);
        await catalogLock(tx);
        for (const projectId of [values.fromProjectId, values.toProjectId]) {
          const [p] = await tx
            .select()
            .from(project)
            .where(eq(project.id, projectId));
          if (!p || p.status !== 'published')
            throw new WorkspaceError('Choose published canonical projects.');
        }
        for (const [versionId, projectId] of [
          [values.fromVersionId, values.fromProjectId],
          [values.toVersionId, values.toProjectId],
        ])
          if (
            versionId &&
            (await release(tx, versionId)).source.projectId !== projectId
          )
            throw new WorkspaceError(
              'Scoped releases must belong to their projects.',
            );
        if (values.toVersionId && values.versionRange)
          throw new WorkspaceError(
            'Choose an exact target release or a range, not both.',
          );
        const [record] = await tx
          .insert(relation)
          .values({ ...values, actorId: actor })
          .returning();
        await tx.insert(audit).values({
          actorId: actor,
          projectId: values.fromProjectId,
          event: 'compatibility_relationship_added',
          detail: { relationshipId: record.id, ...values },
        });
        return record;
      });
    },
    async revoke(
      actor: string,
      kind: 'evidence' | 'relationship',
      id: string,
      reason: string,
    ) {
      uuid.parse(id);
      z.string().trim().min(10).max(2000).parse(reason);
      return db.transaction(async (tx) => {
        await curator(tx, actor);
        await catalogLock(tx);
        const table = kind === 'evidence' ? evidence : relation;
        const records = await tx
          .update(table)
          .set({ revokedAt: new Date() })
          .where(eq(table.id, id))
          .returning({ id: table.id });
        if (!records.length)
          throw new WorkspaceError('Evidence or relationship not found.');
        await tx.insert(audit).values({
          actorId: actor,
          event: 'compatibility_record_revoked',
          detail: { kind, id, reason },
        });
      });
    },
    async submitCommunity(
      actor: string,
      workspaceId: string,
      entryId: string,
      input: unknown,
    ) {
      const values = communityReportInput.parse(input);
      const now = new Date();
      if (
        values.observedAt > now ||
        values.observedAt.getTime() < now.getTime() - COMMUNITY_MAX_AGE_MS
      )
        throw new WorkspaceError('Use an observation from the last 90 days.');
      return db.transaction(async (tx) => {
        const runtime = await workspaces.authorize(
          tx,
          actor,
          workspaceId,
          'content',
          true,
        );
        // Per-reporter lock prevents concurrent submissions from bypassing rate limits.
        await tx.execute(
          sql`SELECT pg_advisory_xact_lock(hashtextextended(${`community:${actor}`}, 0))`,
        );
        const [u] = await tx.select().from(user).where(eq(user.id, actor));
        if (!u || u.banned || u.createdAt.getTime() > now.getTime() - 7 * day)
          throw new WorkspaceError(
            'Community reports require a non-banned account at least seven days old.',
          );
        const [selected] = await tx
          .select()
          .from(entry)
          .where(
            and(
              eq(entry.workspaceId, workspaceId),
              eq(entry.id, uuid.parse(entryId)),
            ),
          );
        if (!selected?.versionId || !selected.enabled)
          throw new WorkspaceError(
            'Select an exact catalog release on an enabled stack entry before reporting.',
          );
        if (
          selected.versionId !== values.versionId ||
          runtime.platform !== values.platform ||
          runtime.minecraftVersion !== values.minecraftVersion
        )
          throw new WorkspaceError(
            'The selected release or runtime changed. Reload before reporting your test.',
          );
        const recent = await tx
          .select()
          .from(community)
          .where(
            and(
              eq(community.userId, actor),
              gte(community.submittedAt, new Date(now.getTime() - day)),
            ),
          );
        if (recent.length >= 5)
          throw new WorkspaceError(
            'Limit: five reports per day and one revision per target per day.',
          );
        const [existing] = await tx
          .select()
          .from(community)
          .where(
            and(
              eq(community.userId, actor),
              eq(community.versionId, selected.versionId),
              eq(community.platform, runtime.platform),
              eq(community.minecraftVersion, runtime.minecraftVersion),
            ),
          );
        if (existing && existing.submittedAt.getTime() > now.getTime() - day)
          throw new WorkspaceError(
            'Wait 24 hours before revising a report for this target.',
          );
        const row = {
          userId: actor,
          versionId: selected.versionId,
          platform: runtime.platform,
          minecraftVersion: runtime.minecraftVersion,
          result: values.result,
          detail: values.detail,
          consentedAt: now,
          observedAt: values.observedAt,
          submittedAt: now,
          status: 'pending' as const,
          reviewerId: null,
          reviewReason: null,
          reviewedAt: null,
        };
        const [record] = await tx
          .insert(community)
          .values(row)
          .onConflictDoUpdate({
            target: [
              community.userId,
              community.versionId,
              community.platform,
              community.minecraftVersion,
            ],
            set: row,
          })
          .returning();
        return record;
      });
    },
    async reviewCommunity(
      actor: string,
      id: string,
      approved: boolean,
      reason: string,
    ) {
      uuid.parse(id);
      z.string().trim().min(10).max(2000).parse(reason);
      return db.transaction(async (tx) => {
        await curator(tx, actor);
        const [r] = await tx
          .select()
          .from(community)
          .where(eq(community.id, id))
          .for('update');
        if (!r || r.status === 'withdrawn')
          throw new WorkspaceError('Report unavailable for review.');
        if (r.userId === actor)
          throw new WorkspaceError('You cannot review your own report.');
        await tx
          .update(community)
          .set({
            status: approved ? 'approved' : 'rejected',
            reviewerId: actor,
            reviewedAt: new Date(),
            reviewReason: reason,
          })
          .where(eq(community.id, id));
        await tx.insert(audit).values({
          actorId: actor,
          event: 'community_compatibility_reviewed',
          detail: { reportId: id, approved, reason },
        });
      });
    },
    async withdrawCommunity(actor: string, id: string) {
      const rows = await db
        .update(community)
        .set({ status: 'withdrawn', detail: '' })
        .where(
          and(eq(community.id, uuid.parse(id)), eq(community.userId, actor)),
        )
        .returning({ id: community.id });
      if (!rows.length)
        throw new WorkspaceError('Report not found.', 'not_found');
    },
    async myReports(actor: string, page = 1) {
      page = Number.isSafeInteger(page) && page > 0 ? Math.min(page, 10000) : 1;
      if (!actor) throw new WorkspaceError('Sign in first.', 'forbidden');
      const rows = await db
        .select({
          report: community,
          versionName: version.name,
          projectName: project.name,
        })
        .from(community)
        .innerJoin(version, eq(community.versionId, version.id))
        .innerJoin(source, eq(version.sourceId, source.id))
        .innerJoin(project, eq(source.projectId, project.id))
        .where(eq(community.userId, actor))
        .orderBy(desc(community.submittedAt), community.id)
        .limit(26)
        .offset((page - 1) * 25);
      return { rows: rows.slice(0, 25), page, hasNext: rows.length > 25 };
    },
    async operations(actor: string, page = 1) {
      page = Number.isSafeInteger(page) && page > 0 ? Math.min(page, 10000) : 1;
      return db.transaction(async (tx) => {
        await curator(tx, actor);
        const [failures] = await tx
          .select({ count: count() })
          .from(cache)
          .where(sql`${cache.error} IS NOT NULL`);
        const reports = await tx
          .select({
            report: community,
            versionName: version.name,
            projectName: project.name,
          })
          .from(community)
          .innerJoin(version, eq(community.versionId, version.id))
          .innerJoin(source, eq(version.sourceId, source.id))
          .innerJoin(project, eq(source.projectId, project.id))
          .where(eq(community.status, 'pending'))
          .orderBy(community.submittedAt, community.id)
          .limit(51)
          .offset((page - 1) * 50);
        const recordedEvidence = await tx
          .select()
          .from(evidence)
          .orderBy(desc(evidence.createdAt), evidence.id)
          .limit(51)
          .offset((page - 1) * 50);
        const relationships = await tx
          .select()
          .from(relation)
          .orderBy(desc(relation.createdAt), relation.id)
          .limit(51)
          .offset((page - 1) * 50);
        return {
          failures: failures.count,
          reports: reports.slice(0, 50),
          evidence: recordedEvidence.slice(0, 50),
          relationships: relationships.slice(0, 50),
          hasNext:
            reports.length > 50 ||
            recordedEvidence.length > 50 ||
            relationships.length > 50,
        };
      });
    },
  };
}
