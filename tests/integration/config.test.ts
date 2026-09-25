import { PGlite } from '@electric-sql/pglite';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/pglite';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { createCatalogService } from '@/features/catalog/services/catalog-service';
import { createConfigService } from '@/features/workspaces/services/config-service';
import { createStackService } from '@/features/workspaces/services/stack-service';
import { createWorkspaceService } from '@/features/workspaces/services/workspace-service';
import * as schema from '@/lib/db/schema';

import type { WorkspaceDatabase } from '@/features/workspaces/services/workspace-service';

import { applyMigrations } from '../../scripts/migration-utils';
import { catalogFixture } from '../fixtures/catalog';

const client = new PGlite();
const database = drizzle(client, { schema, casing: 'camelCase' });
const db = database as unknown as WorkspaceDatabase;
const configs = createConfigService(db);
const stacks = createStackService(db);
const workspaces = createWorkspaceService(db);
const catalog = createCatalogService(db);
const runtime = {
  name: 'Config test',
  platform: 'paper' as const,
  minecraftVersion: '1.21.11' as const,
};
let workspaceId: string;
let entryId: string;
let projectId: string;
const text =
  '# keep my comment\nsettings:\n  allow-end: true\nprivate-key: secret-fixture-value\n';
const metadata = {
  path: 'bukkit.yml',
  kind: 'server',
  entryId: null,
  profile: 'syntax',
};
const create = () =>
  configs.create('owner', workspaceId, metadata, text, 'paste');
beforeAll(async () => {
  await applyMigrations(client);
  for (const id of ['owner', 'editor', 'viewer', 'outsider', 'admin'])
    await database
      .insert(schema.userTable)
      .values({
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
  projectId = await catalog.importSnapshot(catalogFixture());
  entryId = (await stacks.add('owner', workspaceId, projectId))!.id;
});
afterAll(() => client.close());

describe('private configuration storage', () => {
  it('imports multiple files and exports exact text without private metadata', async () => {
    const f = await create();
    await configs.create(
      'owner',
      workspaceId,
      { ...metadata, path: 'plugins/Oak/config.yaml', kind: 'plugin', entryId },
      'enabled: true\n',
      'upload',
    );
    expect(await configs.list('owner', workspaceId)).toHaveLength(2);
    expect(await configs.list('owner', workspaceId, entryId)).toHaveLength(1);
    expect(await configs.export('owner', workspaceId, f.id)).toEqual({
      filename: 'bukkit.yml',
      content: text,
    });
    expect(
      (await configs.history('owner', workspaceId, f.id))[0],
    ).toMatchObject({ number: 1, author: 'owner', source: 'paste' });
    expect(JSON.stringify(await catalog.detail(projectId))).not.toContain(
      'secret-fixture-value',
    );
    expect(
      JSON.stringify(await workspaces.recentActivity('owner', workspaceId)),
    ).not.toContain('secret-fixture-value');
  });
  it('scopes reads, history, comparisons, exports and writes to the workspace membership', async () => {
    const f = await create();
    for (const actor of ['outsider', 'admin', '']) {
      await expect(configs.detail(actor, workspaceId, f.id)).rejects.toThrow();
      await expect(configs.export(actor, workspaceId, f.id)).rejects.toThrow();
      await expect(configs.history(actor, workspaceId, f.id)).rejects.toThrow();
      await expect(
        configs.compare(actor, workspaceId, f.id, 1, 1),
      ).rejects.toThrow();
    }
    const other = await workspaces.create('owner', {
      ...runtime,
      name: 'Other',
    });
    await expect(configs.detail('owner', other.id, f.id)).rejects.toThrow(
      'not found',
    );
    await expect(
      configs.create(
        'owner',
        other.id,
        { ...metadata, kind: 'plugin', entryId },
        text,
        'paste',
      ),
    ).rejects.toThrow('this workspace');
    await workspaces.addMember('owner', workspaceId, {
      email: 'viewer@example.test',
      role: 'viewer',
    });
    expect((await configs.export('viewer', workspaceId, f.id)).content).toBe(
      text,
    );
    await expect(
      configs.save('viewer', workspaceId, f.id, {
        expectedRevision: 1,
        content: 'a: 2',
      }),
    ).rejects.toThrow('role');
    await expect(
      configs.restore('viewer', workspaceId, f.id, 1, 1, true),
    ).rejects.toThrow('role');
    await expect(
      configs.remove('viewer', workspaceId, f.id, metadata.path, 1),
    ).rejects.toThrow('role');
    await workspaces.addMember('owner', workspaceId, {
      email: 'editor@example.test',
      role: 'editor',
    });
    expect(
      (
        await configs.save('editor', workspaceId, f.id, {
          expectedRevision: 1,
          content: 'a: 2',
        })
      ).revision,
    ).toBe(2);
  });
  it('rejects malformed imports and saves without replacing the last valid revision', async () => {
    await expect(
      configs.create('owner', workspaceId, metadata, 'x: [', 'paste'),
    ).rejects.toThrow('YAML');
    expect(await configs.list('owner', workspaceId)).toHaveLength(0);
    const f = await create();
    await expect(
      configs.save('owner', workspaceId, f.id, {
        content: 'x: [',
        expectedRevision: 1,
      }),
    ).rejects.toThrow('YAML');
    expect(
      (await configs.detail('owner', workspaceId, f.id)).current.content,
    ).toBe(text);
    expect(await configs.history('owner', workspaceId, f.id)).toHaveLength(1);
  });
  it('deduplicates identical saves and rejects stale writes', async () => {
    const f = await create();
    expect(
      await configs.save('owner', workspaceId, f.id, {
        content: text,
        expectedRevision: 1,
      }),
    ).toMatchObject({ unchanged: true, revision: 1 });
    await configs.save('owner', workspaceId, f.id, {
      content: 'x: 2',
      expectedRevision: 1,
      message: 'Changed setting',
    });
    await expect(
      configs.save('owner', workspaceId, f.id, {
        content: 'x: 3',
        expectedRevision: 1,
      }),
    ).rejects.toThrow('changed since');
    expect(
      (await configs.detail('owner', workspaceId, f.id)).current.content,
    ).toBe('x: 2');
    expect(await configs.history('owner', workspaceId, f.id)).toHaveLength(2);
  });
  it('compares revisions and requires confirmation before restoring as a new revision', async () => {
    const f = await create();
    await configs.save('owner', workspaceId, f.id, {
      content: 'x: 2',
      expectedRevision: 1,
    });
    expect(
      (await configs.compare('owner', workspaceId, f.id, 1, 2)).from.content,
    ).toBe(text);
    await expect(
      configs.restore('owner', workspaceId, f.id, 1, 2, false),
    ).rejects.toThrow('Confirm');
    expect(
      (await configs.detail('owner', workspaceId, f.id)).current.number,
    ).toBe(2);
    expect(
      (await configs.restore('owner', workspaceId, f.id, 1, 2, true)).revision,
    ).toBe(3);
    expect(
      (await configs.detail('owner', workspaceId, f.id)).current,
    ).toMatchObject({
      number: 3,
      content: text,
      source: 'restore',
      restoredFrom: 1,
    });
    expect(
      (await configs.restore('owner', workspaceId, f.id, 1, 3, true)).revision,
    ).toBe(4);
  });
  it('caps retained history at 20 and protects revision content from updates', async () => {
    const f = await create();
    for (let n = 2; n <= 23; n++)
      await configs.save('owner', workspaceId, f.id, {
        content: `x: ${n}`,
        expectedRevision: n - 1,
      });
    const rows = await configs.history('owner', workspaceId, f.id);
    expect(rows).toHaveLength(20);
    expect(rows.at(-1)?.number).toBe(4);
    await expect(
      configs.compare('owner', workspaceId, f.id, 1, 23),
    ).rejects.toThrow('expired');
    await expect(
      database
        .update(schema.configRevisionTable)
        .set({ content: 'tampered: true' })
        .where(eq(schema.configRevisionTable.configId, f.id)),
    ).rejects.toThrow();
    await expect(
      database
        .update(schema.configFileTable)
        .set({ currentRevision: 999 })
        .where(eq(schema.configFileTable.id, f.id)),
    ).rejects.toThrow();
  });
  it('keeps configs on plugin removal and allows relinking or intentional unlinking', async () => {
    const f = await configs.create(
      'owner',
      workspaceId,
      { ...metadata, kind: 'plugin', entryId },
      text,
      'paste',
    );
    await stacks.remove('owner', workspaceId, entryId, true);
    expect(
      (await configs.detail('owner', workspaceId, f.id)).file,
    ).toMatchObject({ kind: 'plugin', entryId: null, projectId });
    expect((await configs.export('owner', workspaceId, f.id)).content).toBe(
      text,
    );
    const replacement = (await stacks.add('owner', workspaceId, projectId))!;
    await configs.updateMetadata(
      'owner',
      workspaceId,
      f.id,
      { ...metadata, kind: 'plugin', entryId: replacement.id },
      1,
    );
    expect(
      await configs.list('owner', workspaceId, replacement.id),
    ).toHaveLength(1);
    await configs.updateMetadata(
      'owner',
      workspaceId,
      f.id,
      { ...metadata, kind: 'unlinked' },
      1,
    );
    expect(
      (await configs.detail('owner', workspaceId, f.id)).file,
    ).toMatchObject({ kind: 'unlinked', entryId: null, projectId: null });
  });
  it('preserves linked configuration context across canonical catalog merges', async () => {
    const f = await configs.create(
      'owner',
      workspaceId,
      { ...metadata, kind: 'plugin', entryId },
      text,
      'paste',
    );
    const target = await catalog.manual('admin', {
      ...catalogFixture().metadata,
      name: 'Canonical target',
      url: 'https://example.test/canonical',
      reason: 'Synthetic config merge fixture',
    });
    await catalog.merge('admin', {
      from: projectId,
      into: target.id,
      reason: 'Preserve canonical config relationships',
    });
    expect(
      (await configs.detail('owner', workspaceId, f.id)).file,
    ).toMatchObject({ projectId: target.id, entryId });
  });
  it('keeps archived configs readable but blocks mutations and workspace deletion until explicit cleanup', async () => {
    const f = await create();
    await stacks.remove('owner', workspaceId, entryId, true);
    await workspaces.archive('owner', workspaceId, true);
    expect((await configs.export('owner', workspaceId, f.id)).content).toBe(
      text,
    );
    await expect(
      configs.save('owner', workspaceId, f.id, {
        content: 'x: 2',
        expectedRevision: 1,
      }),
    ).rejects.toThrow('Restore');
    await expect(
      workspaces.delete('owner', workspaceId, runtime.name),
    ).rejects.toThrow('configs');
    await workspaces.archive('owner', workspaceId, false);
    await expect(
      configs.remove('owner', workspaceId, f.id, 'wrong.yml', 1),
    ).rejects.toThrow('exact file path');
    await configs.remove('owner', workspaceId, f.id, 'bukkit.yml', 1);
    expect(
      await database.select().from(schema.configRevisionTable),
    ).toHaveLength(0);
    await workspaces.archive('owner', workspaceId, true);
    await workspaces.delete('owner', workspaceId, runtime.name);
  });
  it('enforces safe unique paths and the per-workspace file cap', async () => {
    await expect(
      configs.create(
        'owner',
        workspaceId,
        { ...metadata, path: '../escape.yml' },
        text,
        'paste',
      ),
    ).rejects.toThrow();
    await create();
    await expect(create()).rejects.toThrow('already exists');
    for (let i = 1; i < 50; i++)
      await configs.create(
        'owner',
        workspaceId,
        { ...metadata, path: `file-${i}.yml` },
        'x: 1',
        'paste',
      );
    await expect(
      configs.create(
        'owner',
        workspaceId,
        { ...metadata, path: 'overflow.yml' },
        text,
        'paste',
      ),
    ).rejects.toThrow('50-config');
  });
  it('treats schema warnings as advisory and refuses corrupted saved YAML on export', async () => {
    const f = await configs.create(
      'owner',
      workspaceId,
      { ...metadata, profile: 'bukkit-basic' },
      'settings:\n  allow-end: wrong\n',
      'paste',
    );
    expect(
      (await configs.detail('owner', workspaceId, f.id)).validation
        .diagnostics[0],
    ).toMatchObject({ category: 'schema', severity: 'warning' });
    // Simulate a corrupted historical record outside application writes.
    await client.exec(
      'ALTER TABLE config_revision DISABLE TRIGGER config_revision_immutable',
    );
    try {
      await database
        .update(schema.configRevisionTable)
        .set({ content: 'x: [' })
        .where(eq(schema.configRevisionTable.configId, f.id));
    } finally {
      await client.exec(
        'ALTER TABLE config_revision ENABLE TRIGGER config_revision_immutable',
      );
    }
    await expect(configs.export('owner', workspaceId, f.id)).rejects.toThrow(
      'YAML',
    );
  });
});
