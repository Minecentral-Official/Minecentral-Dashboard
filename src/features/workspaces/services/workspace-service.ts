import 'server-only';

import { randomUUID } from 'node:crypto';

import { and, desc, eq, exists, isNotNull, isNull, or, sql } from 'drizzle-orm';

import {
  memberInput,
  workspaceIdInput,
  workspaceInput,
} from '@/features/workspaces/schemas/workspace-input';
import {
  workspaceActivityTable as activity,
  workspaceMemberTable as member,
  workspaceTable as workspace,
} from '@/features/workspaces/schemas/workspace.table';
import {
  canUseWorkspace,
  WorkspaceError,
} from '@/features/workspaces/services/workspace-policy';
import * as schema from '@/lib/db/schema';

import type { WorkspaceInput } from '@/features/workspaces/schemas/workspace-input';
import type {
  WorkspacePermission,
  WorkspaceRole,
} from '@/features/workspaces/services/workspace-policy';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';

export type WorkspaceDatabase = NodePgDatabase<typeof schema>;
export function createWorkspaceService(db: WorkspaceDatabase) {
  type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
  type Reader = WorkspaceDatabase | Transaction;
  const accessible = (actorId: string) =>
    or(
      eq(workspace.ownerId, actorId),
      and(
        eq(workspace.visibility, 'team'),
        exists(
          db
            .select({ id: member.userId })
            .from(member)
            .where(
              and(
                eq(member.workspaceId, workspace.id),
                eq(member.userId, actorId),
              ),
            ),
        ),
      ),
    );

  async function access(
    reader: Reader,
    actorId: string,
    id: string,
    permission: WorkspacePermission = 'read',
    lock = false,
  ) {
    if (!actorId || !workspaceIdInput.safeParse(id).success)
      throw new WorkspaceError('Workspace not found.', 'not_found');
    const query = reader.select().from(workspace).where(eq(workspace.id, id));
    const [record] = await (lock ? query.for('update') : query);
    if (!record) throw new WorkspaceError('Workspace not found.', 'not_found');
    let role: WorkspaceRole | null =
      record.ownerId === actorId ? 'owner' : null;
    if (!role && record.visibility === 'team') {
      const [membership] = await reader
        .select()
        .from(member)
        .where(and(eq(member.workspaceId, id), eq(member.userId, actorId)));
      role = membership?.role ?? null;
    }
    if (!role) throw new WorkspaceError('Workspace not found.', 'not_found');
    if (!canUseWorkspace(role, permission))
      throw new WorkspaceError(
        'Your workspace role does not allow this action.',
        'forbidden',
      );
    return { ...record, role };
  }
  async function log(
    tx: Transaction,
    actorId: string,
    id: string,
    event: string,
  ) {
    await tx.insert(activity).values({ workspaceId: id, actorId, event });
    await tx
      .update(workspace)
      .set({ updatedAt: new Date() })
      .where(eq(workspace.id, id));
  }
  function active(record: schema.Workspace) {
    if (record.archivedAt)
      throw new WorkspaceError('Restore this workspace before changing it.');
  }
  return {
    authorize: access,
    async list(actorId: string, archived = false, page = 1) {
      if (!actorId)
        throw new WorkspaceError('Sign in to view workspaces.', 'forbidden');
      const safePage =
        Number.isSafeInteger(page) && page > 0 ? Math.min(page, 10000) : 1;
      const rows = await db
        .select()
        .from(workspace)
        .where(
          and(
            accessible(actorId),
            archived ?
              isNotNull(workspace.archivedAt)
            : isNull(workspace.archivedAt),
          ),
        )
        .orderBy(desc(workspace.updatedAt), workspace.id)
        .limit(25)
        .offset((safePage - 1) * 24);
      return {
        workspaces: rows.slice(0, 24),
        hasNext: rows.length > 24,
        page: safePage,
      };
    },
    get: (actorId: string, id: string) => access(db, actorId, id),
    async create(actorId: string, input: WorkspaceInput) {
      if (!actorId)
        throw new WorkspaceError('Sign in to create a workspace.', 'forbidden');
      const values = workspaceInput.parse(input);
      const id = randomUUID();
      const slugBase =
        values.name
          .toLowerCase()
          .normalize('NFKD')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
          .slice(0, 60)
          .replace(/-$/, '') || 'server';
      return db.transaction(async (tx) => {
        const [record] = await tx
          .insert(workspace)
          .values({
            ...values,
            id,
            ownerId: actorId,
            slug: `${slugBase}-${id.slice(0, 8)}`,
            visibility: 'private',
          })
          .returning();
        await log(tx, actorId, id, 'Workspace created');
        return record;
      });
    },
    async update(actorId: string, id: string, input: WorkspaceInput) {
      return db.transaction(async (tx) => {
        const record = await access(tx, actorId, id, 'settings', true);
        active(record);
        const values = workspaceInput.parse(input);
        if (values.visibility !== record.visibility && record.role !== 'owner')
          throw new WorkspaceError(
            'Only the owner can change sharing.',
            'forbidden',
          );
        const [updated] = await tx
          .update(workspace)
          .set(values)
          .where(eq(workspace.id, id))
          .returning();
        await log(tx, actorId, id, 'Settings updated');
        return updated;
      });
    },
    async members(actorId: string, id: string) {
      await access(db, actorId, id, 'members');
      return db
        .select({
          userId: member.userId,
          role: member.role,
          name: schema.userTable.name,
          email: schema.userTable.email,
        })
        .from(member)
        .innerJoin(schema.userTable, eq(member.userId, schema.userTable.id))
        .where(eq(member.workspaceId, id))
        .orderBy(member.createdAt);
    },
    async addMember(actorId: string, id: string, input: unknown) {
      const values = memberInput.parse(input);
      return db.transaction(async (tx) => {
        const record = await access(tx, actorId, id, 'members', true);
        active(record);
        const users = await tx
          .select({ id: schema.userTable.id })
          .from(schema.userTable)
          .where(sql`lower(${schema.userTable.email}) = ${values.email}`)
          .limit(2);
        if (users.length !== 1)
          throw new WorkspaceError(
            'Ask this teammate to sign in to MineCentral first, then check their account email.',
          );
        const user = users[0];
        if (user.id === record.ownerId)
          throw new WorkspaceError('The owner already has full access.');
        await tx
          .insert(member)
          .values({ workspaceId: id, userId: user.id, role: values.role })
          .onConflictDoUpdate({
            target: [member.workspaceId, member.userId],
            set: { role: values.role },
          });
        await tx
          .update(workspace)
          .set({ visibility: 'team' })
          .where(eq(workspace.id, id));
        await log(tx, actorId, id, 'Collaborator access updated');
      });
    },
    async removeMember(actorId: string, id: string, userId: string) {
      return db.transaction(async (tx) => {
        const record = await access(tx, actorId, id, 'members', true);
        if (userId === record.ownerId)
          throw new WorkspaceError('The owner cannot be removed.');
        await tx
          .delete(member)
          .where(and(eq(member.workspaceId, id), eq(member.userId, userId)));
        await log(tx, actorId, id, 'Collaborator removed');
      });
    },
    async archive(actorId: string, id: string, archived: boolean) {
      return db.transaction(async (tx) => {
        await access(tx, actorId, id, 'lifecycle', true);
        await tx
          .update(workspace)
          .set({ archivedAt: archived ? new Date() : null })
          .where(eq(workspace.id, id));
        await log(
          tx,
          actorId,
          id,
          archived ? 'Workspace archived' : 'Workspace restored',
        );
      });
    },
    async delete(actorId: string, id: string, confirmation: string) {
      return db.transaction(async (tx) => {
        const record = await access(tx, actorId, id, 'lifecycle', true);
        if (!record.archivedAt)
          throw new WorkspaceError(
            'Archive this workspace before deleting it.',
          );
        if (confirmation !== record.name)
          throw new WorkspaceError(
            'Type the exact workspace name to confirm deletion.',
          );
        const [stackEntry] = await tx
          .select({ id: schema.stackEntryTable.id })
          .from(schema.stackEntryTable)
          .where(eq(schema.stackEntryTable.workspaceId, id))
          .limit(1);
        if (stackEntry)
          throw new WorkspaceError(
            'Restore the workspace and remove its stack entries before deleting it.',
          );
        const [config] = await tx
          .select({ id: schema.configFileTable.id })
          .from(schema.configFileTable)
          .where(eq(schema.configFileTable.workspaceId, id))
          .limit(1);
        if (config)
          throw new WorkspaceError(
            'Restore the workspace, then export and delete its configs before deleting it.',
          );
        // Membership/activity are workspace-owned and cascade. Future domain FKs must
        // restrict deletion until their retention/export policy is implemented.
        await tx.delete(workspace).where(eq(workspace.id, id));
      });
    },
    async recentActivity(actorId: string, id: string) {
      await access(db, actorId, id);
      return db
        .select({
          id: activity.id,
          event: activity.event,
          createdAt: activity.createdAt,
        })
        .from(activity)
        .where(eq(activity.workspaceId, id))
        .orderBy(desc(activity.createdAt))
        .limit(8);
    },
  };
}
