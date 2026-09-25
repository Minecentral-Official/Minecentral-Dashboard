import 'server-only';

import { createHash } from 'node:crypto';

import { and, asc, count, desc, eq, lt, sql } from 'drizzle-orm';
import { z } from 'zod';

import {
  CONFIG_HISTORY_LIMIT,
  CONFIG_MAX_FILES,
  configId,
  configMetadata,
  configSaveInput,
} from '@/features/workspaces/schemas/config-input';
import {
  inspectConfig,
  serializeConfig,
} from '@/features/workspaces/services/config-yaml';
import { WorkspaceError } from '@/features/workspaces/services/workspace-policy';
import { createWorkspaceService } from '@/features/workspaces/services/workspace-service';
import {
  workspaceActivityTable as activity,
  stackEntryTable as entry,
  configFileTable as file,
  catalogProjectTable as project,
  configRevisionTable as revision,
  userTable as user,
} from '@/lib/db/schema';

import type { WorkspaceDatabase } from '@/features/workspaces/services/workspace-service';

const hash = (text: string) => createHash('sha256').update(text).digest('hex');
const revisionNumber = z.number().int().positive();
export function createConfigService(db: WorkspaceDatabase) {
  type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];
  type Reader = WorkspaceDatabase | Tx;
  const workspaces = createWorkspaceService(db);
  async function writable(tx: Tx, actor: string, workspaceId: string) {
    const w = await workspaces.authorize(
      tx,
      actor,
      workspaceId,
      'content',
      true,
    );
    if (w.archivedAt)
      throw new WorkspaceError(
        'Restore this workspace before changing its configs.',
      );
  }
  async function getFile(reader: Reader, workspaceId: string, id: string) {
    const [record] = await reader
      .select()
      .from(file)
      .where(
        and(eq(file.workspaceId, workspaceId), eq(file.id, configId.parse(id))),
      );
    if (!record)
      throw new WorkspaceError('Configuration not found.', 'not_found');
    return record;
  }
  async function getRevision(reader: Reader, id: string, number: number) {
    const [record] = await reader
      .select()
      .from(revision)
      .where(
        and(
          eq(revision.configId, id),
          eq(revision.number, revisionNumber.parse(number)),
        ),
      );
    if (!record)
      throw new WorkspaceError(
        'Revision not found. It may have expired under the history limit.',
        'not_found',
      );
    return record;
  }
  async function association(
    tx: Tx,
    workspaceId: string,
    values: z.infer<typeof configMetadata>,
  ) {
    if (values.kind !== 'plugin') {
      if (values.entryId)
        throw new WorkspaceError(
          'Choose a plugin association or clear the stack entry.',
        );
      return { entryId: null, projectId: null };
    }
    if (!values.entryId)
      throw new WorkspaceError('Choose a plugin from this workspace.');
    await tx.execute(sql`SELECT pg_advisory_xact_lock(72721402)`);
    const [selected] = await tx
      .select()
      .from(entry)
      .where(
        and(eq(entry.workspaceId, workspaceId), eq(entry.id, values.entryId)),
      );
    if (!selected)
      throw new WorkspaceError('Choose a plugin from this workspace.');
    return { entryId: selected.id, projectId: selected.projectId };
  }
  async function uniquePath(
    tx: Tx,
    workspaceId: string,
    path: string,
    except?: string,
  ) {
    const [found] = await tx
      .select({ id: file.id })
      .from(file)
      .where(and(eq(file.workspaceId, workspaceId), eq(file.path, path)));
    if (found && found.id !== except)
      throw new WorkspaceError(
        'A config with this path already exists in this workspace.',
      );
  }
  async function log(
    tx: Tx,
    actor: string,
    workspaceId: string,
    event: string,
  ) {
    // Do not put paths, contents, change messages or secret values into activity.
    await tx.insert(activity).values({ workspaceId, actorId: actor, event });
  }
  async function append(
    tx: Tx,
    actor: string,
    record: typeof file.$inferSelect,
    content: string,
    source: 'edit' | 'restore',
    message: string,
    restoredFrom?: number,
  ) {
    serializeConfig(content, record.profile);
    const previous = await getRevision(tx, record.id, record.currentRevision);
    if (
      source !== 'restore' &&
      previous.contentHash === hash(content) &&
      previous.content === content
    )
      return {
        revision: previous.number,
        unchanged: true,
        diagnostics: inspectConfig(content, record.profile).diagnostics,
      };
    const number = record.currentRevision + 1;
    await tx
      .insert(revision)
      .values({
        configId: record.id,
        number,
        content,
        contentHash: hash(content),
        authorId: actor,
        source,
        message,
        restoredFrom,
      });
    await tx
      .update(file)
      .set({ currentRevision: number, updatedAt: new Date() })
      .where(eq(file.id, record.id));
    await tx
      .delete(revision)
      .where(
        and(
          eq(revision.configId, record.id),
          lt(revision.number, number - CONFIG_HISTORY_LIMIT + 1),
        ),
      );
    await log(
      tx,
      actor,
      record.workspaceId,
      source === 'restore' ?
        'Configuration revision restored'
      : 'Configuration saved',
    );
    return {
      revision: number,
      unchanged: false,
      diagnostics: inspectConfig(content, record.profile).diagnostics,
    };
  }
  function expected(record: typeof file.$inferSelect, number: number) {
    if (record.currentRevision !== revisionNumber.parse(number))
      throw new WorkspaceError(
        'This config changed since you opened it. Your draft is still here; copy it before reloading to compare the latest revision.',
      );
  }
  return {
    async list(actor: string, workspaceId: string, entryId?: string) {
      await workspaces.authorize(db, actor, workspaceId);
      return db
        .select({ file, projectName: project.name })
        .from(file)
        .leftJoin(project, eq(file.projectId, project.id))
        .where(
          and(
            eq(file.workspaceId, workspaceId),
            entryId ? eq(file.entryId, configId.parse(entryId)) : undefined,
          ),
        )
        .orderBy(asc(file.path))
        .limit(CONFIG_MAX_FILES);
    },
    async choices(actor: string, workspaceId: string) {
      await workspaces.authorize(db, actor, workspaceId);
      return db
        .select({ id: entry.id, name: project.name })
        .from(entry)
        .innerJoin(project, eq(entry.projectId, project.id))
        .where(eq(entry.workspaceId, workspaceId))
        .orderBy(project.name, entry.id)
        .limit(1000);
    },
    async detail(actor: string, workspaceId: string, id: string) {
      await workspaces.authorize(db, actor, workspaceId);
      const record = await getFile(db, workspaceId, id);
      const current = await getRevision(db, record.id, record.currentRevision);
      return {
        file: record,
        current,
        validation: inspectConfig(current.content, record.profile),
      };
    },
    async create(
      actor: string,
      workspaceId: string,
      input: unknown,
      content: string,
      source: 'upload' | 'paste',
    ) {
      const values = configMetadata.parse(input);
      z.enum(['upload', 'paste']).parse(source);
      return db.transaction(async (tx) => {
        await writable(tx, actor, workspaceId);
        serializeConfig(content, values.profile);
        const [total] = await tx
          .select({ count: count() })
          .from(file)
          .where(eq(file.workspaceId, workspaceId));
        if (total.count >= CONFIG_MAX_FILES)
          throw new WorkspaceError(
            'This workspace has reached its 50-config limit. Export and remove an unused file first.',
          );
        await uniquePath(tx, workspaceId, values.path);
        const link = await association(tx, workspaceId, values);
        const [record] = await tx
          .insert(file)
          .values({ ...values, ...link, workspaceId, source })
          .returning();
        await tx
          .insert(revision)
          .values({
            configId: record.id,
            number: 1,
            content,
            contentHash: hash(content),
            authorId: actor,
            source,
          });
        await log(tx, actor, workspaceId, 'Configuration imported');
        return record;
      });
    },
    async save(actor: string, workspaceId: string, id: string, input: unknown) {
      const values = configSaveInput.parse(input);
      return db.transaction(async (tx) => {
        await writable(tx, actor, workspaceId);
        const record = await getFile(tx, workspaceId, id);
        expected(record, values.expectedRevision);
        return append(
          tx,
          actor,
          record,
          values.content,
          'edit',
          values.message,
        );
      });
    },
    async updateMetadata(
      actor: string,
      workspaceId: string,
      id: string,
      input: unknown,
      expectedRevision: number,
    ) {
      const values = configMetadata.parse(input);
      return db.transaction(async (tx) => {
        await writable(tx, actor, workspaceId);
        const record = await getFile(tx, workspaceId, id);
        expected(record, expectedRevision);
        await uniquePath(tx, workspaceId, values.path, id);
        const link = await association(tx, workspaceId, values);
        await tx
          .update(file)
          .set({ ...values, ...link, updatedAt: new Date() })
          .where(eq(file.id, id));
        await log(tx, actor, workspaceId, 'Configuration association updated');
      });
    },
    async history(actor: string, workspaceId: string, id: string) {
      await workspaces.authorize(db, actor, workspaceId);
      await getFile(db, workspaceId, id);
      return db
        .select({
          id: revision.id,
          number: revision.number,
          source: revision.source,
          message: revision.message,
          restoredFrom: revision.restoredFrom,
          createdAt: revision.createdAt,
          author: user.name,
        })
        .from(revision)
        .leftJoin(user, eq(revision.authorId, user.id))
        .where(eq(revision.configId, id))
        .orderBy(desc(revision.number))
        .limit(CONFIG_HISTORY_LIMIT);
    },
    async compare(
      actor: string,
      workspaceId: string,
      id: string,
      from: number,
      to: number,
    ) {
      await workspaces.authorize(db, actor, workspaceId);
      const record = await getFile(db, workspaceId, id);
      return {
        file: record,
        from: await getRevision(db, id, from),
        to: await getRevision(db, id, to),
      };
    },
    async restore(
      actor: string,
      workspaceId: string,
      id: string,
      number: number,
      expectedRevision: number,
      confirmed: boolean,
    ) {
      return db.transaction(async (tx) => {
        await writable(tx, actor, workspaceId);
        const record = await getFile(tx, workspaceId, id);
        expected(record, expectedRevision);
        if (confirmed !== true)
          throw new WorkspaceError(
            'Confirm restore before replacing the current content.',
          );
        const older = await getRevision(tx, id, number);
        return append(
          tx,
          actor,
          record,
          older.content,
          'restore',
          `Restored revision ${older.number}`,
          older.number,
        );
      });
    },
    async export(actor: string, workspaceId: string, id: string) {
      await workspaces.authorize(db, actor, workspaceId);
      const record = await getFile(db, workspaceId, id);
      const current = await getRevision(db, id, record.currentRevision);
      return {
        filename: record.path.split('/').at(-1)!,
        content: serializeConfig(current.content, record.profile),
      };
    },
    async remove(
      actor: string,
      workspaceId: string,
      id: string,
      confirmation: string,
      expectedRevision: number,
    ) {
      return db.transaction(async (tx) => {
        await writable(tx, actor, workspaceId);
        const record = await getFile(tx, workspaceId, id);
        expected(record, expectedRevision);
        if (confirmation !== record.path)
          throw new WorkspaceError(
            'Type the exact file path to delete this config and its history.',
          );
        await tx.delete(file).where(eq(file.id, id));
        await log(
          tx,
          actor,
          workspaceId,
          'Configuration and retained history deleted',
        );
      });
    },
  };
}
