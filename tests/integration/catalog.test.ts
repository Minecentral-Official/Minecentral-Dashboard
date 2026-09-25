import { PGlite } from '@electric-sql/pglite';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/pglite';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { createCatalogService } from '@/features/catalog/services/catalog-service';
import { runCatalogWorker } from '@/features/catalog/services/catalog-worker';
import { SourceError } from '@/features/catalog/services/source-client';
import * as schema from '@/lib/db/schema';

import type { CatalogDatabase } from '@/features/catalog/services/catalog-service';

import { applyMigrations } from '../../scripts/migration-utils';
import { catalogFixture } from '../fixtures/catalog';

const client = new PGlite();
const database = drizzle(client, { schema, casing: 'camelCase' });
const service = createCatalogService(database as unknown as CatalogDatabase);
beforeAll(async () => {
  await applyMigrations(client);
  for (const role of ['user', 'curator', 'moderator', 'admin'] as const)
    await database.insert(schema.userTable).values({
      id: role,
      name: role,
      email: `${role}@example.test`,
      emailVerified: true,
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
});
beforeEach(async () => {
  await client.exec(
    'TRUNCATE catalog_audit, catalog_job, catalog_version, catalog_source, catalog_project CASCADE',
  );
});
afterAll(async () => {
  await client.close();
});
describe('catalog persistence and operations', () => {
  it('refreshes idempotently and keeps source/version IDs and curated fields', async () => {
    const first = catalogFixture();
    const id = await service.importSnapshot(first);
    const before = await service.detail(id);
    expect(before && 'project' in before).toBe(true);
    await service.curate(
      'curator',
      id,
      { name: 'Curated Oak' },
      'Confirmed official display name',
    );
    first.metadata.name = 'Upstream changed';
    await service.importSnapshot(first);
    const after = await service.detail(id);
    if (!before || !after || !before.project || !after.project)
      throw Error('missing');
    expect(after.project.name).toBe('Curated Oak');
    expect(after.sources[0].metadata.name).toBe('Upstream changed');
    expect(after.versions[0].version.id).toBe(before.versions[0].version.id);
    expect(after.project.slug).toBe(before.project.slug);
    expect(
      await database.select().from(schema.catalogProjectTable),
    ).toHaveLength(1);
  });
  it('never auto-merges names and preserves sources, versions, history and redirects on reviewed merge', async () => {
    const from = await service.importSnapshot(catalogFixture());
    const into = await service.importSnapshot(catalogFixture('hangar'));
    expect(from).not.toBe(into);
    await service.merge('curator', {
      from,
      into,
      reason: 'Author confirms both official listings',
    });
    const result = await service.detail(into);
    if (!result || !result.project) throw Error('missing');
    expect(result.sources).toHaveLength(2);
    expect(result.versions).toHaveLength(2);
    expect(await service.detail(from)).toMatchObject({
      redirect: { id: into },
    });
    expect((await service.search({})).projects).toHaveLength(1);
    await service.importSnapshot(catalogFixture());
    expect((await service.search({})).projects).toHaveLength(1);
    expect(
      await database
        .select()
        .from(schema.catalogAuditTable)
        .where(eq(schema.catalogAuditTable.event, 'projects_merged')),
    ).toHaveLength(1);
    await expect(
      service.merge('curator', {
        from: into,
        into: from,
        reason: 'Attempt a cyclic redirect',
      }),
    ).rejects.toThrow('unmerged');
  });
  it('denies ordinary users and moderators every curation mutation', async () => {
    const id = await service.importSnapshot(catalogFixture());
    for (const actor of ['user', 'moderator', 'missing']) {
      await expect(
        service.queue(actor, { provider: 'modrinth', locator: 'oak' }),
      ).rejects.toThrow('Forbidden');
      await expect(
        service.manual(actor, {
          ...catalogFixture().metadata,
          url: 'https://example.test',
          reason: 'Author permission recorded',
        }),
      ).rejects.toThrow('Forbidden');
      await expect(
        service.curate(
          actor,
          id,
          { name: 'Takeover' },
          'Unauthorized rename attempt',
        ),
      ).rejects.toThrow('Forbidden');
      await expect(
        service.merge(actor, {
          from: id,
          into: '00000000-0000-4000-8000-000000000001',
          reason: 'Unauthorized merge attempt',
        }),
      ).rejects.toThrow('Forbidden');
      await expect(service.operations(actor)).rejects.toThrow('Forbidden');
    }
  });
  it('supports manual external-only projects with unknown release support', async () => {
    const p = await service.manual('admin', {
      ...catalogFixture().metadata,
      name: 'External plugin',
      platforms: [],
      url: 'https://www.spigotmc.org/resources/example.1/',
      reason: 'Original owner-provided summary',
    });
    const result = await service.detail(p.id);
    expect(result).toMatchObject({
      sources: [{ provider: 'manual', status: 'manual', lastSyncedAt: null }],
      versions: [],
    });
    expect((await service.search({ source: 'manual' })).projects).toHaveLength(
      1,
    );
    expect(
      (await service.search({ gameVersion: '1.21.11' })).projects,
    ).toHaveLength(0);
  });
  it('combines filters on the same release and does not call proxy versions Minecraft versions', async () => {
    const snap = catalogFixture();
    snap.versions.push({
      ...snap.versions[0],
      externalId: 'proxy',
      support: [{ platform: 'velocity', kind: 'platform', versions: ['3.4'] }],
    });
    await service.importSnapshot(snap);
    expect(
      (
        await service.search({
          q: 'permissions',
          category: 'utility',
          source: 'modrinth',
          platform: 'paper',
          gameVersion: '1.21.11',
        })
      ).projects,
    ).toHaveLength(1);
    for (const params of [
      { platform: 'velocity', gameVersion: '1.21.11' },
      { gameVersion: '3.4' },
      { category: 'economy' },
      { source: 'hangar' },
      { q: 'nonexistent' },
    ])
      expect((await service.search(params)).projects).toHaveLength(0);
  });
  it('hides withdrawn versions and unavailable sources while preserving history', async () => {
    const snap = catalogFixture();
    const id = await service.importSnapshot(snap);
    await service.importSnapshot({ ...snap, versions: [] });
    const result = await service.detail(id);
    expect(result).toMatchObject({ versions: [] });
    expect(
      await database.select().from(schema.catalogVersionTable),
    ).toHaveLength(1);
    await service.queue('curator', {
      provider: 'modrinth',
      locator: snap.locator,
    });
    const j = await service.claim();
    if (!j) throw Error('missing job');
    await service.fail(j, 'Source HTTP 404', 404, 0);
    expect(await service.detail(id)).toBeNull();
    expect((await service.search({})).projects).toHaveLength(0);
    await service.importSnapshot(snap);
    expect((await service.search({})).projects).toHaveLength(1);
  });
  it('deduplicates queued jobs, retries with backoff, and runs ingestion outside reads', async () => {
    await service.queue('curator', { provider: 'modrinth', locator: 'oak' });
    await service.queue('curator', { provider: 'modrinth', locator: 'oak' });
    expect((await service.operations('curator')).jobs).toHaveLength(1);
    const failed = await runCatalogWorker(service, {
      snapshot: async () => {
        throw new SourceError('Source HTTP 429', 429, 600);
      },
    });
    expect(failed.failed).toBe(1);
    const [j] = (await service.operations('curator')).jobs;
    expect(j.status).toBe('queued');
    expect(j.nextAttemptAt.getTime()).toBeGreaterThan(Date.now() + 590000);
    expect(await service.claim()).toBeNull();
    await database
      .update(schema.catalogJobTable)
      .set({ nextAttemptAt: new Date(0) })
      .where(eq(schema.catalogJobTable.id, j.id));
    expect(
      await runCatalogWorker(service, {
        snapshot: async () => catalogFixture(),
      }),
    ).toEqual({ completed: 1, failed: 0 });
    expect((await service.search({})).projects).toHaveLength(1);
  });
  it('automatically schedules due sources and recovers interrupted workers', async () => {
    await service.importSnapshot(catalogFixture());
    await database
      .update(schema.catalogSourceTable)
      .set({ nextSyncAt: new Date(0) })
      .where(eq(schema.catalogSourceTable.provider, 'modrinth'));
    await service.schedule();
    const first = await service.claim();
    if (!first) throw Error('missing');
    await database
      .update(schema.catalogJobTable)
      .set({ startedAt: new Date(0) })
      .where(eq(schema.catalogJobTable.id, first.id));
    const retry = await service.claim();
    expect(retry?.id).toBe(first.id);
    expect(retry?.attempts).toBe(2);
  });
  it('uses the remaining source overview when a preferred merged source disappears', async () => {
    const modrinth = await service.importSnapshot(catalogFixture());
    const hangar = await service.importSnapshot({
      ...catalogFixture('hangar'),
      metadata: { ...catalogFixture().metadata, name: 'Hangar overview' },
    });
    await service.merge('curator', {
      from: hangar,
      into: modrinth,
      reason: 'Confirmed same official publisher',
    });
    expect(await service.detail(modrinth)).toMatchObject({
      project: { name: 'Hangar overview' },
    });
    await service.queue('curator', { provider: 'hangar', locator: '42' });
    const job = await service.claim();
    if (!job) throw new Error('Missing job');
    await service.fail(job, 'Source HTTP 404', 404, 0);
    expect(await service.detail(modrinth)).toMatchObject({
      project: { name: 'Oak Permissions' },
    });
  });
  it('paginates consistently and hides unpublished projects', async () => {
    for (let i = 0; i < 14; i++)
      await service.importSnapshot({
        ...catalogFixture(),
        externalId: `p${i}`,
        locator: `p${i}`,
      });
    const first = await service.search({ limit: '12' });
    const second = await service.search({ limit: '12', page: '2' });
    expect(first.projects).toHaveLength(12);
    expect(first.hasNext).toBe(true);
    expect(second.projects).toHaveLength(2);
    expect(
      new Set([...first.projects, ...second.projects].map((p) => p.id)).size,
    ).toBe(14);
    await database
      .update(schema.catalogProjectTable)
      .set({ status: 'hidden' })
      .where(eq(schema.catalogProjectTable.id, first.projects[0].id));
    expect(await service.detail(first.projects[0].id)).toBeNull();
  });
});
