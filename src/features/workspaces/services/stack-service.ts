import 'server-only';

import {
  and,
  asc,
  count,
  desc,
  eq,
  ilike,
  inArray,
  ne,
  or,
  sql,
} from 'drizzle-orm';
import { z } from 'zod';

import {
  declaredSupport,
  parseStackImport,
  stackId,
  stackMetadataInput,
  versionInput,
} from '@/features/workspaces/schemas/stack-input';
import { WorkspaceError } from '@/features/workspaces/services/workspace-policy';
import { createWorkspaceService } from '@/features/workspaces/services/workspace-service';
import {
  workspaceActivityTable as activity,
  stackChangeTable as change,
  stackEntryTable as entry,
  catalogProjectTable as project,
  catalogSourceTable as source,
  catalogVersionTable as version,
  workspaceTable as workspace,
} from '@/lib/db/schema';

import type {
  ImportPreview,
  ImportResult,
} from '@/features/workspaces/schemas/stack-input';
import type { WorkspaceDatabase } from '@/features/workspaces/services/workspace-service';

export function createStackService(db: WorkspaceDatabase) {
  type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];
  type Reader = WorkspaceDatabase | Tx;
  const workspaces = createWorkspaceService(db);
  async function writable(tx: Tx, actor: string, id: string) {
    const record = await workspaces.authorize(tx, actor, id, 'content', true);
    if (record.archivedAt)
      throw new WorkspaceError(
        'Restore this workspace before changing its stack.',
      );
    // Serialize against catalog merge/import to keep project/version attribution consistent.
    await tx.execute(sql`SELECT pg_advisory_xact_lock(72721402)`);
    return record;
  }
  async function getEntry(reader: Reader, workspaceId: string, id: string) {
    const [record] = await reader
      .select()
      .from(entry)
      .where(
        and(
          eq(entry.workspaceId, workspaceId),
          eq(entry.id, stackId.parse(id)),
        ),
      );
    if (!record)
      throw new WorkspaceError('Stack entry not found.', 'not_found');
    return record;
  }
  async function canonical(reader: Reader, id: string, allowHidden = false) {
    const [p] = await reader
      .select()
      .from(project)
      .where(eq(project.id, stackId.parse(id)));
    if (!p) throw new WorkspaceError('Project unavailable.');
    if (p.status === 'merged' && p.mergedIntoId) {
      const [target] = await reader
        .select()
        .from(project)
        .where(
          and(eq(project.id, p.mergedIntoId), eq(project.status, 'published')),
        );
      if (target) return target;
    }
    if (p.status !== 'published' && !(allowHidden && p.status === 'hidden'))
      throw new WorkspaceError('Project unavailable.');
    return p;
  }
  async function selectedVersion(tx: Tx, projectId: string, input: unknown) {
    const parsed = versionInput.parse(input);
    if (parsed.versionSource === 'unknown')
      return {
        versionSource: 'unknown' as const,
        versionId: null,
        manualVersion: null,
      };
    if (parsed.versionSource === 'manual')
      return {
        versionSource: 'manual' as const,
        versionId: null,
        manualVersion: parsed.manualVersion,
      };
    const [v] = await tx
      .select({ id: version.id })
      .from(version)
      .innerJoin(source, eq(version.sourceId, source.id))
      .where(
        and(eq(version.id, parsed.versionId), eq(source.projectId, projectId)),
      );
    if (!v)
      throw new WorkspaceError('Choose a release belonging to this plugin.');
    return {
      versionSource: 'catalog' as const,
      versionId: v.id,
      manualVersion: null,
    };
  }
  async function changed(
    tx: Tx,
    actorId: string,
    workspaceId: string,
    entryId: string,
    event: typeof change.$inferInsert.event,
  ) {
    await tx.insert(change).values({ workspaceId, entryId, event });
    await tx.insert(activity).values({
      workspaceId,
      actorId,
      event: `Stack ${
        event === 'version' ? 'installed version updated'
        : event === 'metadata' ? 'notes or state updated'
        : `plugin ${event}`
      }`,
    });
    await tx
      .update(workspace)
      .set({ updatedAt: new Date() })
      .where(eq(workspace.id, workspaceId));
  }
  async function insert(
    tx: Tx,
    actor: string,
    workspaceId: string,
    projectId: string,
    input: unknown,
    addedVia: 'catalog' | 'import',
  ) {
    const p = await canonical(tx, projectId);
    const selection = await selectedVersion(tx, p.id, input);
    const [record] = await tx
      .insert(entry)
      .values({ workspaceId, projectId: p.id, ...selection, addedVia })
      .onConflictDoNothing({ target: [entry.workspaceId, entry.projectId] })
      .returning();
    if (record) await changed(tx, actor, workspaceId, record.id, 'added');
    return record;
  }
  const relevant = (runtime: { platform: string; minecraftVersion: string }) =>
    sql`EXISTS (SELECT 1 FROM jsonb_array_elements(${version.support}) AS s WHERE s->>'platform' = ${runtime.platform} AND s->>'kind' = 'minecraft' AND s->'versions' ? ${runtime.minecraftVersion})`;
  async function preview(
    reader: Reader,
    text: string,
  ): Promise<ImportPreview[]> {
    const items = parseStackImport(text);
    const rows: ImportPreview[] = [];
    for (const item of items) {
      // Exact names, canonical IDs and already-known source URLs only; never fetch user URLs.
      const matches = await reader
        .selectDistinct({ id: project.id, name: project.name })
        .from(project)
        .leftJoin(source, eq(source.projectId, project.id))
        .where(
          and(
            eq(project.status, 'published'),
            or(
              sql`lower(${project.name}) = lower(${item.project})`,
              sql`${project.id}::text = ${item.project}`,
              sql`rtrim(${source.url}, '/') = ${item.project.replace(/\/$/, '')}`,
            ),
          ),
        )
        .orderBy(project.name, project.id)
        .limit(21);
      rows.push({
        ...item,
        candidates: matches,
        status:
          matches.length === 1 ? 'matched'
          : matches.length ? 'ambiguous'
          : 'unresolved',
      });
    }
    return rows;
  }
  return {
    async count(actor: string, workspaceId: string) {
      await workspaces.get(actor, workspaceId);
      const [row] = await db
        .select({ count: count() })
        .from(entry)
        .where(eq(entry.workspaceId, workspaceId));
      return row.count;
    },
    async list(
      actor: string,
      workspaceId: string,
      params: Record<string, string | string[] | undefined> = {},
    ) {
      const runtime = await workspaces.get(actor, workspaceId);
      const q =
        typeof params.q === 'string' ? params.q.trim().slice(0, 150) : '';
      const state =
        params.state === 'enabled' || params.state === 'disabled' ?
          params.state
        : '';
      const sort = params.sort === 'updated' ? 'updated' : 'name';
      const filter = and(
        eq(entry.workspaceId, workspaceId),
        q ?
          or(ilike(project.name, `%${q}%`), ilike(entry.alias, `%${q}%`))
        : undefined,
        state ? eq(entry.enabled, state === 'enabled') : undefined,
      );
      const [total] = await db
        .select({ count: count() })
        .from(entry)
        .where(eq(entry.workspaceId, workspaceId));
      const [matching] = await db
        .select({ count: count() })
        .from(entry)
        .innerJoin(project, eq(entry.projectId, project.id))
        .where(filter);
      const requested = Number(params.page);
      const page =
        Number.isSafeInteger(requested) && requested > 0 ?
          Math.min(requested, Math.max(1, Math.ceil(matching.count / 24)))
        : 1;
      const rows = await db
        .select({ entry, project, version, provider: source.provider })
        .from(entry)
        .innerJoin(project, eq(entry.projectId, project.id))
        .leftJoin(version, eq(entry.versionId, version.id))
        .leftJoin(source, eq(version.sourceId, source.id))
        .where(filter)
        .orderBy(
          sort === 'updated' ? desc(entry.updatedAt) : asc(project.name),
          entry.id,
        )
        .limit(24)
        .offset((page - 1) * 24);
      const latest =
        rows.length ?
          await db
            .selectDistinctOn([source.projectId], {
              projectId: source.projectId,
              name: version.name,
              provider: source.provider,
            })
            .from(version)
            .innerJoin(source, eq(version.sourceId, source.id))
            .where(
              and(
                inArray(
                  source.projectId,
                  rows.map((r) => r.project.id),
                ),
                eq(version.available, 1),
                ne(source.status, 'unavailable'),
                relevant(runtime),
              ),
            )
            .orderBy(source.projectId, desc(version.publishedAt), version.id)
        : [];
      return {
        rows: rows.map((r) => ({
          ...r,
          latest: latest.find((v) => v.projectId === r.project.id) ?? null,
          support:
            r.version ?
              declaredSupport(r.version.support, runtime)
            : ('unknown' as const),
        })),
        total: total.count,
        matching: matching.count,
        page,
        hasNext: page * 24 < matching.count,
        q,
        state,
        sort,
      };
    },
    async detail(actor: string, workspaceId: string, id: string) {
      await workspaces.get(actor, workspaceId);
      const record = await getEntry(db, workspaceId, id);
      const [selected] =
        record.versionId ?
          await db
            .select({ name: version.name })
            .from(version)
            .where(eq(version.id, record.versionId))
        : [];
      return { ...record, installedName: selected?.name ?? null };
    },
    async releases(
      actor: string,
      workspaceId: string,
      projectId: string,
      params: { all?: boolean; page?: number } = {},
    ) {
      const runtime = await workspaces.get(actor, workspaceId);
      const p = await canonical(db, projectId, true);
      if (p.status === 'hidden') {
        const [saved] = await db
          .select({ id: entry.id })
          .from(entry)
          .where(
            and(eq(entry.workspaceId, workspaceId), eq(entry.projectId, p.id)),
          )
          .limit(1);
        if (!saved) throw new WorkspaceError('Project unavailable.');
      }
      const page =
        Number.isSafeInteger(params.page) && params.page! > 0 ?
          Math.min(params.page!, 10000)
        : 1;
      const rows = await db
        .select({
          version,
          provider: source.provider,
          sourceStatus: source.status,
        })
        .from(version)
        .innerJoin(source, eq(version.sourceId, source.id))
        .where(
          and(
            eq(source.projectId, p.id),
            params.all ? undefined : (
              and(
                eq(version.available, 1),
                ne(source.status, 'unavailable'),
                relevant(runtime),
              )
            ),
          ),
        )
        .orderBy(desc(version.publishedAt), version.id)
        .limit(26)
        .offset((page - 1) * 25);
      return {
        project: p,
        rows: rows.slice(0, 25).map((r) => ({
          ...r,
          support: declaredSupport(r.version.support, runtime),
        })),
        page,
        hasNext: rows.length > 25,
      };
    },
    async add(
      actor: string,
      workspaceId: string,
      projectId: string,
      input: unknown = { versionSource: 'unknown' },
    ) {
      return db.transaction(async (tx) => {
        await writable(tx, actor, workspaceId);
        return insert(tx, actor, workspaceId, projectId, input, 'catalog');
      });
    },
    async setVersion(
      actor: string,
      workspaceId: string,
      id: string,
      input: unknown,
    ) {
      return db.transaction(async (tx) => {
        await writable(tx, actor, workspaceId);
        const record = await getEntry(tx, workspaceId, id);
        const selection = await selectedVersion(tx, record.projectId, input);
        if (
          record.versionSource === selection.versionSource &&
          record.versionId === selection.versionId &&
          record.manualVersion === selection.manualVersion
        )
          return;
        await tx
          .update(entry)
          .set({
            ...selection,
            versionChangedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(entry.id, record.id));
        await changed(tx, actor, workspaceId, id, 'version');
      });
    },
    async metadata(
      actor: string,
      workspaceId: string,
      id: string,
      input: unknown,
    ) {
      const values = stackMetadataInput.parse(input);
      return db.transaction(async (tx) => {
        await writable(tx, actor, workspaceId);
        await getEntry(tx, workspaceId, id);
        await tx
          .update(entry)
          .set({ ...values, updatedAt: new Date() })
          .where(and(eq(entry.id, id), eq(entry.workspaceId, workspaceId)));
        await changed(tx, actor, workspaceId, id, 'metadata');
      });
    },
    async remove(
      actor: string,
      workspaceId: string,
      id: string,
      confirmed: boolean,
    ) {
      return db.transaction(async (tx) => {
        await writable(tx, actor, workspaceId);
        await getEntry(tx, workspaceId, id);
        if (confirmed !== true)
          throw new WorkspaceError(
            'Confirm removal of this entry and its private notes.',
          );
        await tx
          .delete(entry)
          .where(and(eq(entry.workspaceId, workspaceId), eq(entry.id, id)));
        await changed(tx, actor, workspaceId, id, 'removed');
      });
    },
    async previewImport(actor: string, workspaceId: string, text: string) {
      await workspaces.authorize(db, actor, workspaceId, 'content');
      return preview(db, text);
    },
    async import(
      actor: string,
      workspaceId: string,
      text: string,
      choices: unknown,
    ) {
      const selections = z
        .record(z.string().max(3), z.union([stackId, z.literal('')]))
        .parse(choices);
      return db.transaction(async (tx) => {
        await writable(tx, actor, workspaceId);
        const rows = await preview(tx, text);
        const results: ImportResult[] = [];
        for (const [i, row] of rows.entries()) {
          const chosen = selections[String(i)];
          if (chosen === '') {
            results.push({ project: row.project, status: 'skipped' });
            continue;
          }
          const candidate =
            chosen ? row.candidates.find((c) => c.id === chosen)
            : row.status === 'matched' ? row.candidates[0]
            : undefined;
          if (!candidate) {
            results.push({ project: row.project, status: 'unresolved' });
            continue;
          }
          const record = await insert(
            tx,
            actor,
            workspaceId,
            candidate.id,
            row.version ?
              { versionSource: 'manual', manualVersion: row.version }
            : { versionSource: 'unknown' },
            'import',
          );
          results.push({
            project: row.project,
            status: record ? 'added' : 'skipped',
          });
        }
        return results;
      });
    },
  };
}
