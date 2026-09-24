import { PGlite } from '@electric-sql/pglite';
import { eq, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/pglite';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { createWorkspaceService } from '@/features/workspaces/services/workspace-service';
import * as schema from '@/lib/db/schema';

import type { WorkspaceDatabase } from '@/features/workspaces/services/workspace-service';

import { applyMigrations } from '../../scripts/migration-utils';

const client = new PGlite();
const database = drizzle(client, { schema, casing: 'camelCase' });
const service = createWorkspaceService(
  database as unknown as WorkspaceDatabase,
);
const input = {
  name: 'Oakwood',
  platform: 'paper' as const,
  minecraftVersion: '1.21.11' as const,
  javaVersion: 21,
};
beforeAll(async () => {
  await applyMigrations(client);
  for (const id of ['owner', 'outsider', 'teammate', 'second', 'global-admin'])
    await database
      .insert(schema.userTable)
      .values({
        id,
        name: id,
        email: `${id}@example.test`,
        emailVerified: false,
        role: id === 'global-admin' ? 'admin' : 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
});
beforeEach(async () => {
  await client.exec('TRUNCATE server_workspace CASCADE');
});
afterAll(async () => {
  await client.close();
});

describe('private workspace lifecycle', () => {
  it('creates multiple independent private workspaces without public listings', async () => {
    const first = await service.create('owner', {
      ...input,
      visibility: 'team',
    });
    const second = await service.create('owner', input);
    expect(first.id).not.toBe(second.id);
    expect(first.slug).not.toBe(second.slug);
    expect(first.visibility).toBe('private');
    expect((await service.list('owner')).workspaces).toHaveLength(2);
    expect(await database.select().from(schema.serverTable)).toHaveLength(0);
    expect((await service.get('owner', first.id)).role).toBe('owner');
  });
  it('does not expose other users’ workspaces, even to a global app admin', async () => {
    const record = await service.create('owner', input);
    for (const user of ['outsider', 'global-admin']) {
      expect((await service.list(user)).workspaces).toHaveLength(0);
      await expect(service.get(user, record.id)).rejects.toThrow('not found');
      await expect(service.update(user, record.id, input)).rejects.toThrow(
        'not found',
      );
      await expect(service.archive(user, record.id, true)).rejects.toThrow(
        'not found',
      );
      await expect(
        service.addMember(user, record.id, {
          email: 'teammate@example.test',
          role: 'admin',
        }),
      ).rejects.toThrow('not found');
      await expect(service.recentActivity(user, record.id)).rejects.toThrow(
        'not found',
      );
    }
    await expect(service.get('owner', 'invalid-id')).rejects.toThrow(
      'not found',
    );
  });
  it('rejects invalid runtime metadata before inserting records', async () => {
    await expect(
      service.create('owner', { ...input, javaVersion: 17 }),
    ).rejects.toThrow();
    await expect(
      service.create('owner', { ...input, name: '  ' }),
    ).rejects.toThrow();
    await expect(
      service.create('owner', { ...input, connectionPort: 25565 }),
    ).rejects.toThrow();
    expect((await service.list('owner')).workspaces).toHaveLength(0);
  });
  it('keeps ID and slug stable when changing settings and records activity', async () => {
    const record = await service.create('owner', input);
    await service.update('owner', record.id, {
      ...input,
      name: 'Renamed',
      notes: 'Private note',
      javaVersion: null,
    });
    const updated = await service.get('owner', record.id);
    expect(updated.name).toBe('Renamed');
    expect(updated.slug).toBe(record.slug);
    expect(updated.notes).toBe('Private note');
    expect(updated.javaVersion).toBeNull();
    expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(
      record.updatedAt.getTime(),
    );
    expect(
      (await service.recentActivity('owner', record.id)).map(
        (event) => event.event,
      ),
    ).toContain('Settings updated');
  });
  it('only lists assigned workspaces and enforces each collaborator role', async () => {
    const one = await service.create('owner', input);
    const two = await service.create('owner', { ...input, name: 'Unassigned' });
    for (const role of ['viewer', 'editor', 'admin'] as const) {
      await service.addMember('owner', one.id, {
        email: 'TEAMMATE@example.test',
        role,
      });
      expect(
        (await service.list('teammate')).workspaces.map((row) => row.id),
      ).toEqual([one.id]);
      expect((await service.get('teammate', one.id)).role).toBe(role);
      await expect(service.get('teammate', two.id)).rejects.toThrow(
        'not found',
      );
      if (role === 'admin')
        await service.update('teammate', one.id, {
          ...input,
          name: 'Team edit',
          visibility: 'team',
        });
      else
        await expect(
          service.update('teammate', one.id, { ...input, visibility: 'team' }),
        ).rejects.toThrow('role');
      await expect(service.archive('teammate', one.id, true)).rejects.toThrow(
        'role',
      );
      await expect(
        service.delete('teammate', one.id, 'Team edit'),
      ).rejects.toThrow('role');
      await expect(
        service.addMember('teammate', one.id, {
          email: 'outsider@example.test',
          role: 'admin',
        }),
      ).rejects.toThrow('role');
    }
    expect(await service.members('owner', one.id)).toHaveLength(1);
  });
  it('allows only the owner to change sharing and honors revocation immediately', async () => {
    const record = await service.create('owner', input);
    await service.addMember('owner', record.id, {
      email: 'teammate@example.test',
      role: 'admin',
    });
    await expect(
      service.update('teammate', record.id, {
        ...input,
        visibility: 'private',
      }),
    ).rejects.toThrow('Only the owner');
    await service.update('owner', record.id, {
      ...input,
      visibility: 'private',
    });
    await expect(service.get('teammate', record.id)).rejects.toThrow(
      'not found',
    );
    await service.update('owner', record.id, { ...input, visibility: 'team' });
    expect((await service.get('teammate', record.id)).role).toBe('admin');
    await service.removeMember('owner', record.id, 'teammate');
    expect((await service.list('teammate')).workspaces).toHaveLength(0);
    await expect(service.update('teammate', record.id, input)).rejects.toThrow(
      'not found',
    );
  });
  it('does not send invitations or grant unknown users access', async () => {
    const record = await service.create('owner', input);
    await expect(
      service.addMember('owner', record.id, {
        email: 'missing@example.test',
        role: 'viewer',
      }),
    ).rejects.toThrow('sign in');
    await expect(
      service.addMember('owner', record.id, {
        email: 'owner@example.test',
        role: 'viewer',
      }),
    ).rejects.toThrow('owner');
    await expect(
      service.removeMember('owner', record.id, 'owner'),
    ).rejects.toThrow('owner');
    expect((await service.get('owner', record.id)).visibility).toBe('private');
  });
  it('archives reversibly and requires archive plus exact confirmation to delete', async () => {
    const record = await service.create('owner', input);
    await expect(
      service.delete('owner', record.id, record.name),
    ).rejects.toThrow('Archive');
    await service.addMember('owner', record.id, {
      email: 'teammate@example.test',
      role: 'viewer',
    });
    await service.archive('owner', record.id, true);
    expect((await service.list('owner')).workspaces).toHaveLength(0);
    expect((await service.list('owner', true)).workspaces).toHaveLength(1);
    await expect(service.update('owner', record.id, input)).rejects.toThrow(
      'Restore',
    );
    await expect(
      service.addMember('owner', record.id, {
        email: 'outsider@example.test',
        role: 'viewer',
      }),
    ).rejects.toThrow('Restore');
    await expect(service.delete('owner', record.id, 'wrong')).rejects.toThrow(
      'exact',
    );
    await service.archive('owner', record.id, false);
    expect((await service.get('teammate', record.id)).archivedAt).toBeNull();
    await service.archive('owner', record.id, true);
    const other = await service.create('second', input);
    await service.delete('owner', record.id, record.name);
    expect(
      await database
        .select()
        .from(schema.workspaceMemberTable)
        .where(eq(schema.workspaceMemberTable.workspaceId, record.id)),
    ).toHaveLength(0);
    expect(
      await database
        .select()
        .from(schema.workspaceActivityTable)
        .where(eq(schema.workspaceActivityTable.workspaceId, record.id)),
    ).toHaveLength(0);
    expect((await service.get('second', other.id)).name).toBe(input.name);
    expect(await database.select().from(schema.userTable)).toHaveLength(5);
  });
  it('paginates without leaking unrelated or archived workspaces', async () => {
    for (let i = 0; i < 26; i++)
      await service.create('owner', { ...input, name: `Server ${i}` });
    await service.create('outsider', input);
    const first = await service.list('owner');
    const second = await service.list('owner', false, 2);
    expect(first.workspaces).toHaveLength(24);
    expect(first.hasNext).toBe(true);
    expect(second.workspaces).toHaveLength(2);
    expect(second.hasNext).toBe(false);
    expect(
      new Set([...first.workspaces, ...second.workspaces].map((row) => row.id))
        .size,
    ).toBe(26);
  });
  it('enforces runtime constraints and preserves owned workspaces when an account deletion is attempted', async () => {
    const record = await service.create('owner', input);
    await expect(
      database
        .update(schema.workspaceTable)
        .set({ javaVersion: 17 })
        .where(eq(schema.workspaceTable.id, record.id)),
    ).rejects.toThrow();
    await expect(
      database.delete(schema.userTable).where(eq(schema.userTable.id, 'owner')),
    ).rejects.toThrow();
    expect(
      (
        await database.execute(
          sql`SELECT count(*)::int AS count FROM server_workspace`,
        )
      ).rows[0].count,
    ).toBe(1);
  });
});
