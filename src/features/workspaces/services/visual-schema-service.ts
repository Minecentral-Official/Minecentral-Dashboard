import 'server-only';

import { and, desc, eq, isNull, sql } from 'drizzle-orm';
import { z } from 'zod';

import { parseVisualSchema } from '@/features/workspaces/schemas/visual-schema';
import { matchesVersionRange } from '@/features/workspaces/services/compatibility-engine';
import {
  fieldIssues,
  templateDocument,
} from '@/features/workspaces/services/visual-document';
import { WorkspaceError } from '@/features/workspaces/services/workspace-policy';
import { createWorkspaceService } from '@/features/workspaces/services/workspace-service';
import { hasPermission } from '@/lib/auth/helpers/permissions';
import {
  catalogAuditTable,
  catalogProjectTable,
  catalogVersionTable,
  configFileTable,
  stackEntryTable,
  userTable,
  visualSchemaTable,
} from '@/lib/db/schema';

import type { VisualSchema } from '@/features/workspaces/schemas/visual-schema';
import type { WorkspaceDatabase } from '@/features/workspaces/services/workspace-service';

export type SchemaSelection = {
  schema: VisualSchema | null;
  releaseId: string | null;
  reason: string;
  version: string | null;
};
export function chooseSchema(
  candidates: { id: string; definition: VisualSchema; retired: boolean }[],
  target: {
    kind: string;
    filename: string;
    platform: string;
    version: string | null;
  },
): SchemaSelection {
  if (!target.version)
    return {
      schema: null,
      releaseId: null,
      version: null,
      reason:
        'The installed version is unknown. Record it in the stack to check visual editor coverage.',
    };
  const matching = candidates.filter(
    (c) =>
      !c.retired &&
      c.definition.target.kind === target.kind &&
      c.definition.filename === target.filename &&
      c.definition.target.platform === target.platform &&
      matchesVersionRange(target.version, c.definition.target.versionRange) ===
        true,
  );
  matching.sort(
    (a, b) =>
      Number(b.definition.provenance.verifiedVersion === target.version) -
        Number(a.definition.provenance.verifiedVersion === target.version) ||
      b.definition.release - a.definition.release ||
      a.definition.key.localeCompare(b.definition.key) ||
      a.id.localeCompare(b.id),
  );
  const best = matching[0];
  return best ?
      {
        schema: best.definition,
        releaseId: best.id,
        version: target.version,
        reason: `${best.definition.title} · schema release ${best.definition.release}`,
      }
    : {
        schema: null,
        releaseId: null,
        version: target.version,
        reason: `No reviewed visual schema covers ${target.filename} for ${target.platform} ${target.version}. Continue editing YAML.`,
      };
}
export function createVisualSchemaService(db: WorkspaceDatabase) {
  type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];
  async function curator(reader: WorkspaceDatabase | Tx, actor: string) {
    const [user] = await reader
      .select()
      .from(userTable)
      .where(eq(userTable.id, actor));
    if (!user || user.banned || !hasPermission(user.role, 'catalog:curate'))
      throw new WorkspaceError(
        'Catalog curation permission required.',
        'forbidden',
      );
  }
  return {
    async publish(actor: string, projectId: string | null, input: unknown) {
      const definition = parseVisualSchema(input);
      if (definition.target.kind === 'plugin' ? !projectId : projectId !== null)
        throw new WorkspaceError(
          'Plugin schemas require a canonical project; server schemas must not select one.',
        );
      if (projectId) z.string().uuid().parse(projectId);
      if (
        matchesVersionRange(
          definition.provenance.verifiedVersion,
          definition.target.versionRange,
        ) !== true
      )
        throw new WorkspaceError(
          'Use a supported numeric range containing the verified version.',
        );
      if (new Date(definition.provenance.verifiedAt) > new Date())
        throw new WorkspaceError('Verification date cannot be in the future.');
      const nodes = [definition.root];
      while (nodes.length) {
        const f = nodes.pop()!;
        if (
          f.default !== undefined &&
          fieldIssues({ ...f, visibleWhen: undefined }, f.default).some(
            (i) => i.severity === 'error',
          )
        )
          throw new WorkspaceError(`Invalid default for ${f.label}.`);
        nodes.push(...(f.fields ?? []));
        if (f.items) nodes.push(f.items);
      }
      templateDocument(definition);
      return db.transaction(async (tx) => {
        await curator(tx, actor);
        await tx.execute(sql`SELECT pg_advisory_xact_lock(72721402)`);
        if (projectId) {
          const [project] = await tx
            .select()
            .from(catalogProjectTable)
            .where(eq(catalogProjectTable.id, projectId));
          if (!project || project.status === 'merged')
            throw new WorkspaceError('Choose an active canonical project.');
        }
        const prior = await tx
          .select()
          .from(visualSchemaTable)
          .where(eq(visualSchemaTable.key, definition.key));
        if (
          prior.some(
            (p) =>
              p.projectId !== projectId ||
              p.definition.filename !== definition.filename ||
              p.definition.target.kind !== definition.target.kind,
          )
        )
          throw new WorkspaceError(
            'A schema key must retain its project, kind and filename.',
          );
        if (prior.some((p) => p.release >= definition.release))
          throw new WorkspaceError(
            'Publish a new, increasing release number; existing releases are immutable.',
          );
        const [row] = await tx
          .insert(visualSchemaTable)
          .values({
            key: definition.key,
            release: definition.release,
            projectId,
            definition,
            actorId: actor,
          })
          .returning();
        await tx.insert(catalogAuditTable).values({
          actorId: actor,
          projectId,
          event: 'visual_schema_published',
          detail: { id: row.id, key: row.key, release: row.release },
        });
        return row;
      });
    },
    async retire(actor: string, id: string) {
      return db.transaction(async (tx) => {
        await curator(tx, actor);
        const [row] = await tx
          .update(visualSchemaTable)
          .set({ retired: true })
          .where(eq(visualSchemaTable.id, z.string().uuid().parse(id)))
          .returning();
        if (!row) throw new WorkspaceError('Schema release not found.');
        await tx.insert(catalogAuditTable).values({
          actorId: actor,
          projectId: row.projectId,
          event: 'visual_schema_retired',
          detail: { id },
        });
      });
    },
    async list(actor: string) {
      await curator(db, actor);
      return db
        .select()
        .from(visualSchemaTable)
        .orderBy(desc(visualSchemaTable.createdAt), visualSchemaTable.id)
        .limit(100);
    },
    async select(
      actor: string,
      workspaceId: string,
      configId: string,
    ): Promise<SchemaSelection> {
      const workspace = await createWorkspaceService(db).authorize(
        db,
        actor,
        workspaceId,
      );
      const [file] = await db
        .select()
        .from(configFileTable)
        .where(
          and(
            eq(configFileTable.id, z.string().uuid().parse(configId)),
            eq(configFileTable.workspaceId, workspaceId),
          ),
        );
      if (!file) throw new WorkspaceError('Config not found.', 'not_found');
      if (file.kind === 'unlinked' || (file.kind === 'plugin' && !file.entryId))
        return {
          schema: null,
          releaseId: null,
          version: null,
          reason:
            'Link this config to a current stack entry or mark it as a server file to select a visual schema.',
        };
      let installed: string | null = workspace.minecraftVersion;
      if (file.kind === 'plugin') {
        const [entry] = await db
          .select({
            source: stackEntryTable.versionSource,
            manual: stackEntryTable.manualVersion,
            number: catalogVersionTable.versionNumber,
          })
          .from(stackEntryTable)
          .leftJoin(
            catalogVersionTable,
            eq(stackEntryTable.versionId, catalogVersionTable.id),
          )
          .where(
            and(
              eq(stackEntryTable.id, file.entryId!),
              eq(stackEntryTable.workspaceId, workspaceId),
            ),
          );
        installed =
          entry?.source === 'manual' ? entry.manual
          : entry?.source === 'catalog' ? entry.number
          : null;
      }
      const candidates = await db
        .select()
        .from(visualSchemaTable)
        .where(
          and(
            file.projectId ?
              eq(visualSchemaTable.projectId, file.projectId)
            : isNull(visualSchemaTable.projectId),
            eq(visualSchemaTable.retired, false),
          ),
        )
        .orderBy(desc(visualSchemaTable.release))
        .limit(501);
      if (candidates.length > 500)
        return {
          schema: null,
          releaseId: null,
          version: installed,
          reason:
            'Too many schema releases to select safely. Continue with YAML and ask a curator to retire obsolete releases.',
        };
      return chooseSchema(candidates, {
        kind: file.kind,
        filename: file.path.split('/').at(-1)!,
        platform: workspace.platform,
        version: installed,
      });
    },
  };
}
