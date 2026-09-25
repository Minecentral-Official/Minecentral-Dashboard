import { randomUUID } from 'node:crypto';

import { and, asc, desc, eq, exists, inArray, ne, sql } from 'drizzle-orm';

import {
  manualInput,
  mergeInput,
  metadataInput,
  parseCatalogFilters,
  sourceInput,
} from '@/features/catalog/schemas/catalog-input';
import {
  catalogAuditTable as audit,
  catalogJobTable as job,
  catalogProjectTable as project,
  catalogSourceTable as source,
  catalogVersionTable as version,
} from '@/features/catalog/schemas/catalog.table';
import { hasPermission } from '@/lib/auth/helpers/permissions';
import * as schema from '@/lib/db/schema';

import type { CatalogSnapshot } from '@/features/catalog/schemas/catalog-input';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';

export type CatalogDatabase = NodePgDatabase<typeof schema>;
export function createCatalogService(db: CatalogDatabase) {
  type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];
  const lock = (tx: Tx) =>
    tx.execute(sql`SELECT pg_advisory_xact_lock(72721402)`);
  async function curator(tx: Tx, id: string) {
    const [user] = await tx
      .select()
      .from(schema.userTable)
      .where(eq(schema.userTable.id, id));
    if (!user || !hasPermission(user.role, 'catalog:curate'))
      throw new Error('Forbidden');
  }
  async function record(
    tx: Tx,
    actorId: string | null,
    projectId: string | null,
    event: string,
    detail: Record<string, unknown>,
  ) {
    await tx.insert(audit).values({ actorId, projectId, event, detail });
  }
  async function refresh(tx: Tx, id: string) {
    const [p] = await tx.select().from(project).where(eq(project.id, id));
    if (!p || p.status === 'merged') throw new Error('Project unavailable');
    const sources = await tx
      .select()
      .from(source)
      .where(eq(source.projectId, id))
      .orderBy(source.provider, source.externalId);
    const base =
      sources.find((s) => s.status === 'ok' || s.status === 'manual') ??
      sources[0];
    if (base) {
      const metadata = { ...base.metadata, ...p.curated };
      await tx
        .update(project)
        .set({
          metadata,
          name: metadata.name,
          description: metadata.description,
          updatedAt: new Date(),
        })
        .where(eq(project.id, id));
    }
  }
  async function enqueue(
    tx: Tx,
    provider: 'modrinth' | 'hangar',
    locator: string,
  ) {
    const [created] = await tx
      .insert(job)
      .values({ provider, locator })
      .onConflictDoNothing()
      .returning();
    return created;
  }
  return {
    async importSnapshot(snapshot: CatalogSnapshot) {
      return db.transaction(async (tx) => {
        await lock(tx);
        const metadata = metadataInput.parse(snapshot.metadata);
        const [previous] = await tx
          .select()
          .from(source)
          .where(
            and(
              eq(source.provider, snapshot.provider),
              eq(source.externalId, snapshot.externalId),
            ),
          );
        let projectId = previous?.projectId;
        if (!projectId) {
          const [p] = await tx
            .insert(project)
            .values({
              slug:
                metadata.name
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, '-')
                  .replace(/^-|-$/g, '')
                  .slice(0, 100) || 'plugin',
              name: metadata.name,
              description: metadata.description,
              metadata,
            })
            .returning();
          projectId = p.id;
        }
        const now = new Date();
        const [s] = await tx
          .insert(source)
          .values({
            projectId,
            provider: snapshot.provider,
            externalId: snapshot.externalId,
            locator: snapshot.locator,
            url: snapshot.url,
            metadata,
            status: 'ok',
            lastSyncedAt: now,
            lastAttemptAt: now,
            nextSyncAt: new Date(now.getTime() + 86400000),
          })
          .onConflictDoUpdate({
            target: [source.provider, source.externalId],
            set: {
              locator: snapshot.locator,
              url: snapshot.url,
              metadata,
              status: 'ok',
              lastSyncedAt: now,
              lastAttemptAt: now,
              nextSyncAt: new Date(now.getTime() + 86400000),
              failures: 0,
              error: null,
            },
          })
          .returning();
        // Retain IDs/history for withdrawn releases, but never serve them as available.
        await tx
          .update(version)
          .set({ available: 0 })
          .where(eq(version.sourceId, s.id));
        for (const v of snapshot.versions) {
          await tx
            .insert(version)
            .values({
              ...v,
              versionNumber: v.versionNumber ?? null,
              sourceId: s.id,
              publishedAt: new Date(v.publishedAt),
              available: 1,
            })
            .onConflictDoUpdate({
              target: [version.sourceId, version.externalId],
              set: {
                ...v,
                versionNumber: v.versionNumber ?? null,
                publishedAt: new Date(v.publishedAt),
                available: 1,
              },
            });
        }
        await refresh(tx, projectId);
        await record(tx, null, projectId, 'source_synced', {
          sourceId: s.id,
          versions: snapshot.versions.length,
        });
        return projectId;
      });
    },
    async queue(actorId: string, input: unknown) {
      const values = sourceInput.parse(input);
      return db.transaction(async (tx) => {
        await curator(tx, actorId);
        await lock(tx);
        const result = await enqueue(tx, values.provider, values.locator);
        await record(tx, actorId, null, 'sync_requested', values);
        return result;
      });
    },
    async schedule() {
      return db.transaction(async (tx) => {
        await lock(tx);
        const due = await tx
          .select()
          .from(source)
          .where(
            and(
              ne(source.provider, 'manual'),
              sql`${source.nextSyncAt} <= now()`,
            ),
          )
          .limit(50);
        for (const s of due)
          await enqueue(tx, s.provider as 'modrinth' | 'hangar', s.locator);
        return due.length;
      });
    },
    async claim() {
      return db.transaction(async (tx) => {
        // A process killed during a fetch must not strand jobs forever.
        await tx
          .update(job)
          .set({ status: 'queued', error: 'Worker interrupted; retrying.' })
          .where(
            and(
              eq(job.status, 'running'),
              sql`${job.startedAt} < now() - interval '1 hour'`,
            ),
          );
        const [next] = await tx
          .select()
          .from(job)
          .where(
            and(eq(job.status, 'queued'), sql`${job.nextAttemptAt} <= now()`),
          )
          .orderBy(job.createdAt)
          .limit(1)
          .for('update', { skipLocked: true });
        if (!next) return null;
        const [claimed] = await tx
          .update(job)
          .set({
            status: 'running',
            startedAt: new Date(),
            attempts: next.attempts + 1,
            error: null,
          })
          .where(eq(job.id, next.id))
          .returning();
        return claimed;
      });
    },
    async complete(id: string) {
      await db
        .update(job)
        .set({ status: 'done', finishedAt: new Date(), error: null })
        .where(eq(job.id, id));
    },
    async fail(
      j: typeof job.$inferSelect,
      message: string,
      status: number,
      retryAfter: number,
    ) {
      const unavailable = status === 404 || status === 410;
      const permanent = unavailable || status === 422;
      const delay = Math.max(
        retryAfter * 1000,
        Math.min(3600000, 30000 * 2 ** Math.min(j.attempts, 7)),
      );
      return db.transaction(async (tx) => {
        await lock(tx);
        const next = new Date(Date.now() + delay);
        await tx
          .update(job)
          .set({
            status: permanent || j.attempts >= 5 ? 'failed' : 'queued',
            error: message,
            nextAttemptAt: next,
            finishedAt: new Date(),
          })
          .where(eq(job.id, j.id));
        const affected = await tx
          .update(source)
          .set({
            status: unavailable ? 'unavailable' : 'error',
            lastAttemptAt: new Date(),
            nextSyncAt: permanent ? new Date(Date.now() + 86400000) : next,
            failures: sql`${source.failures}+1`,
            error: message,
          })
          .where(
            and(eq(source.provider, j.provider), eq(source.locator, j.locator)),
          )
          .returning({ projectId: source.projectId });
        for (const id of new Set(affected.map((row) => row.projectId)))
          await refresh(tx, id);
      });
    },
    async manual(actorId: string, input: unknown) {
      const values = manualInput.parse(input);
      return db.transaction(async (tx) => {
        await curator(tx, actorId);
        await lock(tx);
        const metadata = metadataInput.parse(values);
        const [p] = await tx
          .insert(project)
          .values({
            slug:
              metadata.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '') || 'plugin',
            name: metadata.name,
            description: metadata.description,
            metadata,
            curated: metadata,
          })
          .returning();
        await tx.insert(source).values({
          projectId: p.id,
          provider: 'manual',
          externalId: randomUUID(),
          locator: values.url,
          url: values.url,
          metadata,
          status: 'manual',
        });
        await record(tx, actorId, p.id, 'manual_created', {
          reason: values.reason,
        });
        return p;
      });
    },
    async curate(actorId: string, id: string, input: unknown, reason: string) {
      const values = metadataInput.partial().parse(input);
      if (reason.trim().length < 10 || reason.length > 2000)
        throw new Error('Explain the curation decision (10–2000 characters).');
      return db.transaction(async (tx) => {
        await curator(tx, actorId);
        await lock(tx);
        const [p] = await tx.select().from(project).where(eq(project.id, id));
        if (!p || p.status === 'merged') throw new Error('Project unavailable');
        await tx
          .update(project)
          .set({ curated: { ...p.curated, ...values } })
          .where(eq(project.id, id));
        await refresh(tx, id);
        await record(tx, actorId, id, 'curated', {
          fields: Object.keys(values),
          reason,
        });
      });
    },
    async merge(actorId: string, input: unknown) {
      const values = mergeInput.parse(input);
      return db.transaction(async (tx) => {
        await curator(tx, actorId);
        await lock(tx);
        const rows = await tx
          .select()
          .from(project)
          .where(inArray(project.id, [values.from, values.into]));
        if (rows.length !== 2 || rows.some((p) => p.status !== 'published'))
          throw new Error('Both projects must be published and unmerged.');
        // Never discard private notes/version selections when canonical projects collide.
        const affected = await tx
          .select()
          .from(schema.stackEntryTable)
          .where(
            inArray(schema.stackEntryTable.projectId, [
              values.from,
              values.into,
            ]),
          );
        const targets = new Set(
          affected
            .filter((e) => e.projectId === values.into)
            .map((e) => e.workspaceId),
        );
        if (
          affected.some(
            (e) => e.projectId === values.from && targets.has(e.workspaceId),
          )
        ) {
          throw new Error(
            'These projects coexist in a private stack. Resolve duplicate stack entries before merging; no private records were changed.',
          );
        }
        for (const e of affected.filter((e) => e.projectId === values.from)) {
          await tx
            .update(schema.stackEntryTable)
            .set({ projectId: values.into, updatedAt: new Date() })
            .where(eq(schema.stackEntryTable.id, e.id));
          await tx.insert(schema.stackChangeTable).values({
            workspaceId: e.workspaceId,
            entryId: e.id,
            event: 'project_merged',
          });
        }
        await tx
          .update(schema.compatibilityRelationshipTable)
          .set({ fromProjectId: values.into })
          .where(
            eq(
              schema.compatibilityRelationshipTable.fromProjectId,
              values.from,
            ),
          );
        await tx
          .update(schema.compatibilityRelationshipTable)
          .set({ toProjectId: values.into })
          .where(
            eq(schema.compatibilityRelationshipTable.toProjectId, values.from),
          );
        // Flatten existing redirects so stable URLs never accumulate redirect chains.
        await tx
          .update(project)
          .set({ mergedIntoId: values.into })
          .where(eq(project.mergedIntoId, values.from));
        await tx
          .update(source)
          .set({ projectId: values.into })
          .where(eq(source.projectId, values.from));
        await tx
          .update(project)
          .set({
            status: 'merged',
            mergedIntoId: values.into,
            updatedAt: new Date(),
          })
          .where(eq(project.id, values.from));
        await refresh(tx, values.into);
        await record(tx, actorId, values.into, 'projects_merged', {
          ...values,
          previousProjects: rows,
        });
      });
    },
    async search(params: Record<string, string | string[] | undefined>) {
      const f = parseCatalogFilters(params);
      const sourceWhere = and(
        eq(source.projectId, project.id),
        ne(source.status, 'unavailable'),
        f.source.length ?
          inArray(
            source.provider,
            f.source as ('modrinth' | 'hangar' | 'manual')[],
          )
        : undefined,
      );
      const support =
        f.platform.length || f.gameVersion.length ?
          sql`EXISTS (SELECT 1 FROM jsonb_array_elements(${version.support}) AS declared(value) WHERE ${
            f.platform.length ?
              sql`declared.value->>'platform' IN (${sql.join(
                f.platform.map((p) => sql`${p}`),
                sql`,`,
              )})`
            : sql`true`
          } AND ${
            f.gameVersion.length ?
              sql`declared.value->>'kind' = 'minecraft' AND declared.value->'versions' ?| ARRAY[${sql.join(
                f.gameVersion.map((v) => sql`${v}`),
                sql`,`,
              )}]::text[]`
            : sql`true`
          })`
        : undefined;
      const filters = and(
        eq(project.status, 'published'),
        exists(db.select({ id: source.id }).from(source).where(sourceWhere)),
        f.q ?
          sql`to_tsvector('simple', ${project.name} || ' ' || ${project.description}) @@ plainto_tsquery('simple', ${f.q})`
        : undefined,
        ...f.category.map(
          (c) =>
            sql`${project.metadata}->'categories' @> ${JSON.stringify([c])}::jsonb`,
        ),
        support ?
          exists(
            db
              .select({ id: version.id })
              .from(version)
              .innerJoin(source, eq(version.sourceId, source.id))
              .where(and(sourceWhere, eq(version.available, 1), support)),
          )
        : undefined,
      );
      const rows = await db
        .select()
        .from(project)
        .where(filters)
        .orderBy(
          f.sort === 'updated' ? desc(project.updatedAt) : asc(project.name),
          project.id,
        )
        .limit(f.limit + 1)
        .offset((f.page - 1) * f.limit);
      return {
        filters: f,
        projects: rows.slice(0, f.limit),
        hasNext: rows.length > f.limit,
      };
    },
    async detail(id: string, page = 1) {
      if (
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          id,
        )
      )
        return null;
      const [p] = await db.select().from(project).where(eq(project.id, id));
      if (!p || p.status === 'hidden') return null;
      if (p.status === 'merged') {
        const [target] = await db
          .select()
          .from(project)
          .where(
            and(
              eq(project.id, p.mergedIntoId!),
              eq(project.status, 'published'),
            ),
          );
        return target ? { redirect: target } : null;
      }
      const sources = await db
        .select()
        .from(source)
        .where(eq(source.projectId, id))
        .orderBy(source.provider);
      if (!sources.some((s) => s.status !== 'unavailable')) return null;
      const safePage =
        Number.isSafeInteger(page) && page > 0 ? Math.min(page, 10000) : 1;
      const versions = await db
        .select({ version, provider: source.provider })
        .from(version)
        .innerJoin(source, eq(version.sourceId, source.id))
        .where(
          and(
            eq(source.projectId, id),
            eq(version.available, 1),
            ne(source.status, 'unavailable'),
          ),
        )
        .orderBy(desc(version.publishedAt), version.id)
        .limit(26)
        .offset((safePage - 1) * 25);
      return {
        project: p,
        sources,
        versions: versions.slice(0, 25),
        hasNext: versions.length > 25,
        page: safePage,
      };
    },
    async operations(actorId: string) {
      return db.transaction(async (tx) => {
        await curator(tx, actorId);
        return {
          jobs: await tx
            .select()
            .from(job)
            .orderBy(desc(job.createdAt))
            .limit(50),
          sources: await tx
            .select()
            .from(source)
            .orderBy(desc(source.lastAttemptAt))
            .limit(50),
        };
      });
    },
  };
}
