import { PGlite } from '@electric-sql/pglite';
import { eq, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/pglite';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { createCatalogService } from '@/features/catalog/services/catalog-service';
import { createStackService } from '@/features/workspaces/services/stack-service';
import { createWorkspaceService } from '@/features/workspaces/services/workspace-service';
import * as schema from '@/lib/db/schema';

import type { WorkspaceDatabase } from '@/features/workspaces/services/workspace-service';

import { applyMigrations } from '../../scripts/migration-utils';
import { catalogFixture } from '../fixtures/catalog';

const client = new PGlite();
const database = drizzle(client, { schema, casing: 'camelCase' });
const db = database as unknown as WorkspaceDatabase;
const stacks = createStackService(db);
const workspaces = createWorkspaceService(db);
const catalog = createCatalogService(db);
const runtime = {
  name: 'Stack test',
  platform: 'paper' as const,
  minecraftVersion: '1.21.11' as const,
};
let workspaceId: string;
let projectId: string;
let versionId: string;
const manual = async (name: string) =>
  catalog.manual('admin', {
    ...catalogFixture().metadata,
    name,
    url: 'https://example.test/' + encodeURIComponent(name),
    reason: 'Synthetic stack test project',
  });
beforeAll(async () => {
  await applyMigrations(client);
  for (const id of ['owner', 'editor', 'viewer', 'outsider', 'admin'])
    await database.insert(schema.userTable).values({
      id,
      name: id,
      email: `${id}@example.test`,
      role: id === 'admin' ? 'admin' : 'user',
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
});
beforeEach(async () => {
  await client.exec('TRUNCATE server_workspace, catalog_project CASCADE');
  workspaceId = (await workspaces.create('owner', runtime)).id;
  await catalog.importSnapshot(catalogFixture());
  projectId = (await database.select().from(schema.catalogProjectTable))[0].id;
  versionId = (await database.select().from(schema.catalogVersionTable))[0].id;
});
afterAll(() => client.close());

describe('private server stacks', () => {
  it('deduplicates additions and records independent version changes with durable hooks', async () => {
    const first = (await stacks.add('owner', workspaceId, projectId))!;
    expect(await stacks.add('owner', workspaceId, projectId)).toBeUndefined();
    await stacks.metadata('owner', workspaceId, first.id, {
      alias: 'Permissions',
      notes: 'private secret note',
      enabled: false,
    });
    await stacks.setVersion('owner', workspaceId, first.id, {
      versionSource: 'catalog',
      versionId,
    });
    expect(await stacks.detail('owner', workspaceId, first.id)).toMatchObject({
      versionId,
      notes: 'private secret note',
      enabled: false,
    });
    const versionChangedAt = (
      await stacks.detail('owner', workspaceId, first.id)
    ).versionChangedAt;
    await stacks.metadata('owner', workspaceId, first.id, {
      alias: '',
      notes: 'still private',
      enabled: true,
    });
    expect(
      (await stacks.detail('owner', workspaceId, first.id)).versionChangedAt,
    ).toEqual(versionChangedAt);
    await stacks.setVersion('owner', workspaceId, first.id, {
      versionSource: 'manual',
      manualVersion: 'custom-2',
    });
    expect(await stacks.detail('owner', workspaceId, first.id)).toMatchObject({
      versionId: null,
      manualVersion: 'custom-2',
    });
    await stacks.setVersion('owner', workspaceId, first.id, {
      versionSource: 'unknown',
    });
    expect(await stacks.detail('owner', workspaceId, first.id)).toMatchObject({
      versionId: null,
      manualVersion: null,
    });
    expect(
      (await database.select().from(schema.stackChangeTable)).filter(
        (e) => e.event === 'version',
      ),
    ).toHaveLength(3);
    expect(JSON.stringify(await catalog.detail(projectId))).not.toContain(
      'still private',
    );
    expect(await stacks.count('owner', workspaceId)).toBe(1);
    await expect(
      database
        .insert(schema.stackEntryTable)
        .values({ workspaceId, projectId, addedVia: 'catalog' }),
    ).rejects.toThrow();
  });
  it('enforces ownership, member roles, private sharing, cross-workspace IDs and archived read-only state', async () => {
    const first = (await stacks.add('owner', workspaceId, projectId))!;
    for (const actor of ['outsider', 'admin', '']) {
      await expect(stacks.list(actor, workspaceId)).rejects.toThrow();
      await expect(stacks.add(actor, workspaceId, projectId)).rejects.toThrow();
      await expect(
        stacks.setVersion(actor, workspaceId, first.id, {
          versionSource: 'unknown',
        }),
      ).rejects.toThrow();
      await expect(
        stacks.metadata(actor, workspaceId, first.id, {
          alias: '',
          notes: '',
          enabled: true,
        }),
      ).rejects.toThrow();
      await expect(
        stacks.remove(actor, workspaceId, first.id, true),
      ).rejects.toThrow();
      await expect(
        stacks.previewImport(actor, workspaceId, 'Oak Permissions'),
      ).rejects.toThrow();
      await expect(
        stacks.import(actor, workspaceId, 'Oak Permissions', {}),
      ).rejects.toThrow();
    }
    for (const role of ['editor', 'viewer'] as const)
      await workspaces.addMember('owner', workspaceId, {
        email: `${role}@example.test`,
        role,
      });
    expect((await stacks.list('viewer', workspaceId)).total).toBe(1);
    await expect(
      stacks.metadata('viewer', workspaceId, first.id, {
        alias: '',
        notes: '',
        enabled: true,
      }),
    ).rejects.toThrow('role');
    await stacks.metadata('editor', workspaceId, first.id, {
      alias: '',
      notes: 'team private',
      enabled: true,
    });
    const other = await workspaces.create('owner', runtime);
    await expect(
      stacks.setVersion('owner', other.id, first.id, {
        versionSource: 'unknown',
      }),
    ).rejects.toThrow('not found');
    await workspaces.archive('owner', workspaceId, true);
    await expect(
      stacks.remove('owner', workspaceId, first.id, true),
    ).rejects.toThrow('Restore');
    await expect(
      workspaces.delete('owner', workspaceId, runtime.name),
    ).rejects.toThrow('remove its stack');
  });
  it('rejects unrelated releases, preserves withdrawn selections, and filters latest relevant evidence', async () => {
    const first = (await stacks.add('owner', workspaceId, projectId, {
      versionSource: 'catalog',
      versionId,
    }))!;
    const snapshot = catalogFixture('hangar');
    snapshot.versions[0].support = [
      { platform: 'velocity', kind: 'platform', versions: ['3.4'] },
    ];
    await catalog.importSnapshot(snapshot);
    const unrelated = (
      await database
        .select()
        .from(schema.catalogVersionTable)
        .where(sql`${schema.catalogVersionTable.id} <> ${versionId}`)
    )[0];
    await expect(
      stacks.setVersion('owner', workspaceId, first.id, {
        versionSource: 'catalog',
        versionId: unrelated.id,
      }),
    ).rejects.toThrow('belonging');
    expect((await stacks.list('owner', workspaceId)).rows[0].latest?.name).toBe(
      'Oak 1.0',
    );
    const withdrawn = catalogFixture();
    withdrawn.versions = [];
    await catalog.importSnapshot(withdrawn);
    expect((await stacks.list('owner', workspaceId)).rows[0]).toMatchObject({
      latest: null,
      version: { id: versionId, available: 0 },
    });
    expect(
      (await stacks.releases('owner', workspaceId, projectId)).rows,
    ).toHaveLength(0);
    expect(
      (await stacks.releases('owner', workspaceId, projectId, { all: true }))
        .rows,
    ).toHaveLength(1);
    await database
      .update(schema.catalogProjectTable)
      .set({ status: 'hidden' })
      .where(eq(schema.catalogProjectTable.id, projectId));
    expect(
      (await stacks.releases('owner', workspaceId, projectId)).project.id,
    ).toBe(projectId);
  });
  it('records unsupported catalog releases with warnings without treating them as latest relevant', async () => {
    const snapshot = catalogFixture();
    snapshot.versions.push({
      ...snapshot.versions[0],
      externalId: 'unsupported',
      name: 'Oak 2.0',
      publishedAt: '2026-02-01T00:00:00Z',
      support: [{ platform: 'paper', kind: 'minecraft', versions: ['1.20.6'] }],
    });
    await catalog.importSnapshot(snapshot);
    const all = await stacks.releases('owner', workspaceId, projectId, {
      all: true,
    });
    expect(all.rows[0]).toMatchObject({
      support: 'unsupported',
      version: { name: 'Oak 2.0' },
    });
    expect(
      (await stacks.releases('owner', workspaceId, projectId)).rows,
    ).toHaveLength(1);
    await stacks.add('owner', workspaceId, projectId, {
      versionSource: 'catalog',
      versionId: all.rows[0].version.id,
    });
    expect((await stacks.list('owner', workspaceId)).rows[0]).toMatchObject({
      support: 'unsupported',
      version: { name: 'Oak 2.0' },
      latest: { name: 'Oak 1.0' },
    });
    await expect(
      database
        .insert(schema.stackEntryTable)
        .values({
          workspaceId,
          projectId: (await manual('Invalid manual')).id,
          addedVia: 'import',
          versionSource: 'manual',
          manualVersion: null,
        }),
    ).rejects.toThrow();
  });
  it('requires removal confirmation and retains change history while updating counts', async () => {
    const first = (await stacks.add('owner', workspaceId, projectId))!;
    await expect(
      stacks.remove('owner', workspaceId, first.id, false),
    ).rejects.toThrow('Confirm');
    expect(await stacks.count('owner', workspaceId)).toBe(1);
    await stacks.remove('owner', workspaceId, first.id, true);
    expect(await stacks.count('owner', workspaceId)).toBe(0);
    expect(
      (await database.select().from(schema.stackChangeTable)).map(
        (e) => e.event,
      ),
    ).toEqual(['added', 'removed']);
  });
  it('imports conservatively, revalidates choices and never overwrites existing local metadata', async () => {
    const duplicate = await manual('Oak Permissions');
    const text = JSON.stringify({
      plugins: [
        { project: 'Oak Permissions', version: 'my-build' },
        { project: 'https://modrinth.com/plugin/oak-permissions' },
        { project: 'Unknown Plugin' },
      ],
    });
    expect(
      (await stacks.previewImport('owner', workspaceId, text)).map(
        (r) => r.status,
      ),
    ).toEqual(['ambiguous', 'matched', 'unresolved']);
    const results = await stacks.import('owner', workspaceId, text, {});
    expect(results.map((r) => r.status)).toEqual([
      'unresolved',
      'added',
      'unresolved',
    ]);
    const first = (await stacks.list('owner', workspaceId)).rows[0].entry;
    await stacks.metadata('owner', workspaceId, first.id, {
      alias: '',
      notes: 'keep',
      enabled: true,
    });
    expect(
      (
        await stacks.import('owner', workspaceId, text, { 0: duplicate.id })
      ).map((r) => r.status),
    ).toEqual(['added', 'skipped', 'unresolved']);
    expect((await stacks.detail('owner', workspaceId, first.id)).notes).toBe(
      'keep',
    );
    expect(
      (
        await stacks.import('owner', workspaceId, 'Unknown Plugin', {
          0: projectId,
        })
      )[0].status,
    ).toBe('unresolved');
  });
  it('paginates and filters 105 entries with stable counts', async () => {
    const projects = await database
      .insert(schema.catalogProjectTable)
      .values(
        Array.from({ length: 105 }, (_, i) => ({
          name: `Plugin ${String(i).padStart(3, '0')}`,
          slug: `plugin-${i}`,
          description: 'fixture',
          metadata: catalogFixture().metadata,
        })),
      )
      .returning();
    await database.insert(schema.stackEntryTable).values(
      projects.map((p, i) => ({
        workspaceId,
        projectId: p.id,
        addedVia: 'import' as const,
        enabled: i % 2 === 0,
      })),
    );
    const first = await stacks.list('owner', workspaceId);
    const second = await stacks.list('owner', workspaceId, { page: '2' });
    expect(first.rows).toHaveLength(24);
    expect(first.total).toBe(105);
    expect(first.hasNext).toBe(true);
    expect(
      new Set([...first.rows, ...second.rows].map((r) => r.entry.id)).size,
    ).toBe(48);
    expect(
      (await stacks.list('owner', workspaceId, { page: '999' })).rows,
    ).toHaveLength(9);
    expect(
      (await stacks.list('owner', workspaceId, { state: 'disabled' })).matching,
    ).toBe(52);
    expect(
      (await stacks.list('owner', workspaceId, { q: 'Plugin 104' })).matching,
    ).toBe(1);
  });
  it('preserves private stack identity on catalog merge and refuses colliding entries', async () => {
    const target = await manual('Canonical Oak');
    const first = (await stacks.add('owner', workspaceId, projectId, {
      versionSource: 'catalog',
      versionId,
    }))!;
    await stacks.metadata('owner', workspaceId, first.id, {
      alias: '',
      notes: 'keep merged notes',
      enabled: true,
    });
    await catalog.merge('admin', {
      from: projectId,
      into: target.id,
      reason: 'Verified duplicate identity',
    });
    expect(await stacks.detail('owner', workspaceId, first.id)).toMatchObject({
      projectId: target.id,
      versionId,
      notes: 'keep merged notes',
    });
    expect(await stacks.add('owner', workspaceId, projectId)).toBeUndefined();
    const conflicting = await manual('Duplicate canonical oak');
    await stacks.add('owner', workspaceId, conflicting.id);
    await expect(
      catalog.merge('admin', {
        from: conflicting.id,
        into: target.id,
        reason: 'Verified duplicate identity',
      }),
    ).rejects.toThrow('coexist');
    expect(await stacks.count('owner', workspaceId)).toBe(2);
  });
});
