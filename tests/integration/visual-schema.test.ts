import { PGlite } from '@electric-sql/pglite';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/pglite';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { createCatalogService } from '@/features/catalog/services/catalog-service';
import { createConfigService } from '@/features/workspaces/services/config-service';
import { createStackService } from '@/features/workspaces/services/stack-service';
import { templateDocument } from '@/features/workspaces/services/visual-document';
import { createVisualSchemaService } from '@/features/workspaces/services/visual-schema-service';
import { createWorkspaceService } from '@/features/workspaces/services/workspace-service';
import * as schema from '@/lib/db/schema';

import type { WorkspaceDatabase } from '@/features/workspaces/services/workspace-service';

import { applyMigrations } from '../../scripts/migration-utils';
import { catalogFixture } from '../fixtures/catalog';
import { visualSchemaFixture as definition } from '../fixtures/visual-schema';

const client = new PGlite();
const database = drizzle(client, { schema, casing: 'camelCase' });
const db = database as unknown as WorkspaceDatabase;
const registry = createVisualSchemaService(db),
  configs = createConfigService(db),
  stacks = createStackService(db),
  workspaces = createWorkspaceService(db),
  catalog = createCatalogService(db);
let workspaceId: string, projectId: string, entryId: string, configId: string;
beforeAll(async () => {
  await applyMigrations(client);
  for (const id of ['owner', 'curator', 'outsider', 'banned'])
    await database.insert(schema.userTable).values({
      id,
      name: id,
      email: `${id}@example.test`,
      role: ['curator', 'banned'].includes(id) ? 'curator' : 'user',
      banned: id === 'banned',
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
});
beforeEach(async () => {
  await client.exec('TRUNCATE server_workspace,catalog_project CASCADE');
  workspaceId = (
    await workspaces.create('owner', {
      name: 'Visual fixture',
      platform: 'paper',
      minecraftVersion: '1.21.11',
    })
  ).id;
  projectId = await catalog.importSnapshot(catalogFixture());
  entryId = (await stacks.add('owner', workspaceId, projectId))!.id;
  await stacks.setVersion('owner', workspaceId, entryId, {
    versionSource: 'manual',
    manualVersion: '1.0',
  });
  configId = (
    await configs.create(
      'owner',
      workspaceId,
      {
        path: 'plugins/Oak/config.yml',
        kind: 'plugin',
        entryId,
        profile: 'syntax',
      },
      templateDocument(definition),
      'paste',
    )
  ).id;
});
afterAll(() => client.close());
describe('curated schema releases', () => {
  it('requires non-banned curation permission and active canonical identity', async () => {
    for (const actor of ['owner', 'outsider', 'banned'])
      await expect(
        registry.publish(actor, projectId, definition),
      ).rejects.toThrow('permission');
    await expect(registry.list('owner')).rejects.toThrow();
    await expect(registry.publish('curator', null, definition)).rejects.toThrow(
      'canonical',
    );
    await expect(
      registry.publish('curator', crypto.randomUUID(), definition),
    ).rejects.toThrow('active canonical');
  });
  it('selects canonical version coverage without exposing private configs to curators', async () => {
    const published = await registry.publish('curator', projectId, definition);
    expect(
      (await registry.select('owner', workspaceId, configId)).releaseId,
    ).toBe(published.id);
    await expect(
      registry.select('curator', workspaceId, configId),
    ).rejects.toThrow();
    await expect(
      registry.select('outsider', workspaceId, configId),
    ).rejects.toThrow();
    expect(await registry.list('curator')).toHaveLength(1);
  });
  it('uses machine version metadata, never the catalog display label', async () => {
    const row = await registry.publish('curator', projectId, definition);
    const [release] = await database
      .select()
      .from(schema.catalogVersionTable)
      .limit(1);
    await stacks.setVersion('owner', workspaceId, entryId, {
      versionSource: 'catalog',
      versionId: release.id,
    });
    expect(
      (await registry.select('owner', workspaceId, configId)).schema,
    ).toBeNull();
    await database
      .update(schema.catalogVersionTable)
      .set({ versionNumber: '1.0' })
      .where(eq(schema.catalogVersionTable.id, release.id));
    expect(
      (await registry.select('owner', workspaceId, configId)).releaseId,
    ).toBe(row.id);
  });
  it('requires increasing immutable schema releases and valid reviewed defaults', async () => {
    const row = await registry.publish('curator', projectId, definition);
    await expect(
      registry.publish('curator', projectId, definition),
    ).rejects.toThrow('increasing');
    await expect(
      database
        .update(schema.visualSchemaTable)
        .set({ definition: { ...definition, title: 'Edited' } })
        .where(eq(schema.visualSchemaTable.id, row.id)),
    ).rejects.toThrow();
    await expect(
      registry.publish('curator', projectId, {
        ...definition,
        release: 2,
        root: {
          ...definition.root,
          fields: [
            { key: 'bad', label: 'Bad', type: 'number', default: 'oops' },
          ],
        },
      }),
    ).rejects.toThrow('default');
    await expect(
      registry.publish('curator', projectId, {
        ...definition,
        release: 2,
        target: { ...definition.target, versionRange: '^1.0' },
      }),
    ).rejects.toThrow('numeric range');
    await registry.publish('curator', projectId, { ...definition, release: 2 });
    expect(
      (await registry.select('owner', workspaceId, configId)).schema?.release,
    ).toBe(2);
  });
  it('supports required settings without publishing invented defaults', async () => {
    const required = {
      ...definition,
      root: {
        ...definition.root,
        fields: [
          ...definition.root.fields!,
          {
            key: 'password',
            label: 'Password',
            type: 'string' as const,
            required: true,
            minLength: 1,
          },
        ],
      },
    };
    const row = await registry.publish('curator', projectId, required);
    expect(() => templateDocument(required)).toThrow('incomplete');
    await expect(
      configs.save('owner', workspaceId, configId, {
        content: templateDocument(definition),
        expectedRevision: 1,
        expectedSchemaId: row.id,
      }),
    ).rejects.toThrow('schema errors');
    const result = await configs.save('owner', workspaceId, configId, {
      content:
        templateDocument(definition) + 'password: synthetic-private-fixture\n',
      expectedRevision: 1,
      expectedSchemaId: row.id,
    });
    expect(result.revision).toBe(2);
  });
  it('falls back for unknown, unsupported, orphaned and unlinked files without changing their YAML', async () => {
    await registry.publish('curator', projectId, definition);
    for (const manualVersion of ['2.0', 'v-next']) {
      await stacks.setVersion('owner', workspaceId, entryId, {
        versionSource: 'manual',
        manualVersion,
      });
      expect(
        (await registry.select('owner', workspaceId, configId)).schema,
      ).toBeNull();
    }
    await stacks.remove('owner', workspaceId, entryId, true);
    expect(
      (await registry.select('owner', workspaceId, configId)).reason,
    ).toContain('Link');
    expect((await configs.export('owner', workspaceId, configId)).content).toBe(
      templateDocument(definition),
    );
    await configs.updateMetadata(
      'owner',
      workspaceId,
      configId,
      {
        path: 'config.yml',
        kind: 'unlinked',
        entryId: null,
        profile: 'syntax',
      },
      1,
    );
    expect(
      (await registry.select('owner', workspaceId, configId)).schema,
    ).toBeNull();
  });
  it('rejects stale schema forms and hard field errors but permits recommendations', async () => {
    const row = await registry.publish('curator', projectId, definition);
    const content = templateDocument(definition).replace(
      'timeout: 30',
      'timeout: 80',
    );
    await expect(
      configs.save('owner', workspaceId, configId, {
        content,
        expectedRevision: 1,
        expectedSchemaId: null,
      }),
    ).rejects.toThrow('coverage changed');
    await expect(
      configs.save('owner', workspaceId, configId, {
        content: content.replace('timeout: 80', 'timeout: 2000'),
        expectedRevision: 1,
        expectedSchemaId: row.id,
      }),
    ).rejects.toThrow();
    const saved = await configs.save('owner', workspaceId, configId, {
      content,
      expectedRevision: 1,
      expectedSchemaId: row.id,
    });
    expect(saved.revision).toBe(2);
    expect(await configs.history('owner', workspaceId, configId)).toHaveLength(
      2,
    );
  });
  it('retirement is audited and removes selection without deleting saved content', async () => {
    const row = await registry.publish('curator', projectId, definition);
    await expect(registry.retire('owner', row.id)).rejects.toThrow();
    await registry.retire('curator', row.id);
    expect(
      (await registry.select('owner', workspaceId, configId)).schema,
    ).toBeNull();
    expect(
      (await configs.export('owner', workspaceId, configId)).content,
    ).toContain('enabled: true');
    const audit = await database
      .select()
      .from(schema.catalogAuditTable)
      .where(eq(schema.catalogAuditTable.event, 'visual_schema_retired'));
    expect(audit).toHaveLength(1);
  });
  it('canonical merges preserve the schema association and file', async () => {
    const row = await registry.publish('curator', projectId, definition);
    const target = await catalog.manual('curator', {
      ...catalogFixture().metadata,
      name: 'Canonical Oak',
      url: 'https://example.test/canonical',
      reason: 'Fixture canonical merge',
    });
    await catalog.merge('curator', {
      from: projectId,
      into: target.id,
      reason: 'Same verified project identity',
    });
    expect(
      (await registry.select('owner', workspaceId, configId)).releaseId,
    ).toBe(row.id);
  });
  it('selects server-level schemas by workspace runtime and exact basename', async () => {
    const server = {
      ...definition,
      key: 'server-example',
      filename: 'bukkit.yml',
      target: {
        ...definition.target,
        kind: 'server' as const,
        versionRange: '=1.21.11',
      },
      provenance: { ...definition.provenance, verifiedVersion: '1.21.11' },
    };
    const row = await registry.publish('curator', null, server);
    await configs.updateMetadata(
      'owner',
      workspaceId,
      configId,
      { path: 'bukkit.yml', kind: 'server', entryId: null, profile: 'syntax' },
      1,
    );
    expect(
      (await registry.select('owner', workspaceId, configId)).releaseId,
    ).toBe(row.id);
  });
});
