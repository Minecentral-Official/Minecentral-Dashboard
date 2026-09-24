import { PGlite } from '@electric-sql/pglite';
import { eq, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/pglite';
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { createCatalogService } from '@/features/catalog/services/catalog-service';
import { resolveCompatibility } from '@/features/workspaces/services/compatibility-engine';
import { createCompatibilityService } from '@/features/workspaces/services/compatibility-service';
import { createStackService } from '@/features/workspaces/services/stack-service';
import { createWorkspaceService } from '@/features/workspaces/services/workspace-service';
import * as schema from '@/lib/db/schema';

import type { WorkspaceDatabase } from '@/features/workspaces/services/workspace-service';

import { applyMigrations } from '../../scripts/migration-utils';
import { catalogFixture } from '../fixtures/catalog';

const client = new PGlite();
const database = drizzle(client, { schema, casing: 'camelCase' });
const db = database as unknown as WorkspaceDatabase;
const catalog = createCatalogService(db);
const stacks = createStackService(db);
const workspaces = createWorkspaceService(db);
let calls = 0;
const service = createCompatibilityService(db, (snapshot, now) => {
  calls++;
  return resolveCompatibility(snapshot, now);
});
const runtime = {
  name: 'Compatibility test',
  platform: 'paper' as const,
  minecraftVersion: '1.21.11' as const,
};
let workspaceId: string;
let projectId: string;
let versionId: string;
let entryId: string;
const day = 86400000;
const evidenceInput = () => ({
  versionId,
  platform: 'paper',
  minecraftVersion: '1.21.11',
  kind: 'manual-curation' as const,
  result: 'incompatible' as const,
  confidence: 'high' as const,
  provenance: 'Reviewed test demonstrates a runtime problem',
  url: 'https://example.test/test-evidence',
  observedAt: new Date(Date.now() - day),
  expiresAt: new Date(Date.now() + day),
});
const reportInput = () => ({
  versionId,
  platform: runtime.platform,
  minecraftVersion: runtime.minecraftVersion,
  result: 'incompatible' as const,
  detail:
    'Tested the exact release on a clean Paper server and observed startup failure.',
  observedAt: new Date(Date.now() - 1000),
  consent: true as const,
});
beforeAll(async () => {
  await applyMigrations(client);
  for (const id of [
    'owner',
    'viewer',
    'outsider',
    'curator',
    'reporter1',
    'reporter2',
    'reporter3',
    'new',
  ])
    await database.insert(schema.userTable).values({
      id,
      name: id,
      email: `${id}@example.test`,
      role: ['curator', 'outsider'].includes(id) ? 'admin' : 'user',
      emailVerified: true,
      createdAt: new Date(Date.now() - (id === 'new' ? 1 : 30) * day),
      updatedAt: new Date(),
    });
});
beforeEach(async () => {
  await client.exec('TRUNCATE server_workspace, catalog_project CASCADE');
  calls = 0;
  await database
    .update(schema.userTable)
    .set({ banned: false })
    .where(sql`true`);
  workspaceId = (await workspaces.create('owner', runtime)).id;
  const fixture = catalogFixture();
  fixture.versions[0].versionNumber = '1.0';
  projectId = await catalog.importSnapshot(fixture);
  versionId = (await database.select().from(schema.catalogVersionTable))[0].id;
  entryId = (await stacks.add('owner', workspaceId, projectId, {
    versionSource: 'catalog',
    versionId,
  }))!.id;
});
afterAll(() => client.close());

describe('compatibility persistence and invalidation', () => {
  it('caches normal reads, consumes stack hooks and invalidates stack, target and catalog changes', async () => {
    const initial = await service.report('owner', workspaceId);
    expect(initial.report?.entries[0].state).toBe('compatible');
    expect(initial.cached).toBe(false);
    expect((await service.report('owner', workspaceId)).cached).toBe(true);
    expect(calls).toBe(1);
    expect(
      (await database.select().from(schema.stackChangeTable)).every(
        (c) => c.processedAt !== null,
      ),
    ).toBe(true);
    await stacks.setVersion('owner', workspaceId, entryId, {
      versionSource: 'unknown',
    });
    expect(
      (await service.report('owner', workspaceId)).report?.entries[0].state,
    ).toBe('unknown');
    await stacks.setVersion('owner', workspaceId, entryId, {
      versionSource: 'catalog',
      versionId,
    });
    await workspaces.update('owner', workspaceId, {
      ...runtime,
      minecraftVersion: '1.20.6',
    });
    expect(
      (await service.report('owner', workspaceId)).report?.entries[0].state,
    ).toBe('incompatible');
    await database
      .update(schema.catalogVersionTable)
      .set({
        support: [
          { platform: 'paper', kind: 'minecraft', versions: ['1.20.6'] },
        ],
      })
      .where(eq(schema.catalogVersionTable.id, versionId));
    expect(
      (await service.report('owner', workspaceId)).report?.entries[0].state,
    ).toBe('compatible');
    expect(calls).toBe(4);
  });
  it('keeps unrelated workspace edits from rebuilding a cached graph', async () => {
    await service.report('owner', workspaceId);
    const other = (await workspaces.create('owner', runtime)).id;
    await stacks.add('owner', other, projectId);
    expect((await service.report('owner', workspaceId)).cached).toBe(true);
    expect(calls).toBe(1);
  });
  it('denies private report access and forced recompute without the workspace role', async () => {
    await service.report('owner', workspaceId);
    for (const actor of ['', 'outsider'])
      await expect(service.report(actor, workspaceId)).rejects.toThrow();
    await workspaces.addMember('owner', workspaceId, {
      email: 'viewer@example.test',
      role: 'viewer',
    });
    expect((await service.report('viewer', workspaceId)).report).not.toBeNull();
    await expect(service.report('viewer', workspaceId, true)).rejects.toThrow(
      'role',
    );
    expect((await service.report('owner', workspaceId, true)).cached).toBe(
      false,
    );
    expect(calls).toBe(2);
  });
  it('persists observable failures, never serves an old verdict as current and supports retry', async () => {
    await service.report('owner', workspaceId);
    const fail = vi.fn(() => {
      throw new Error('synthetic compute failure');
    });
    const broken = createCompatibilityService(db, fail);
    const logging = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      const result = await broken.report('owner', workspaceId, true);
      expect(result.error).toContain('could not be recomputed');
      expect(result.report).toBeNull();
      expect((await broken.report('owner', workspaceId)).cached).toBe(true);
      expect(fail).toHaveBeenCalledTimes(1);
      expect((await service.operations('curator')).failures).toBe(1);
      expect(
        (await service.report('owner', workspaceId, true)).report?.entries[0]
          .state,
      ).toBe('compatible');
      expect((await service.operations('curator')).failures).toBe(0);
    } finally {
      logging.mockRestore();
    }
  });
  it('preserves contradictory and revoked evidence with provenance and invalidates immediately', async () => {
    await service.report('owner', workspaceId);
    await expect(service.addEvidence('owner', evidenceInput())).rejects.toThrow(
      'permission',
    );
    const claim = await service.addEvidence('curator', evidenceInput());
    const conflict = await service.report('owner', workspaceId);
    expect(conflict.report?.entries[0].state).toBe('conflicting-evidence');
    expect(
      conflict.report?.entries[0].evidence.find((e) => e.id === claim.id)?.url,
    ).toBe('https://example.test/test-evidence');
    await service.revoke(
      'curator',
      'evidence',
      claim.id,
      'Observation was reproduced as a configuration error',
    );
    const after = await service.report('owner', workspaceId);
    expect(after.report?.entries[0].state).toBe('compatible');
    expect(
      after.report?.entries[0].evidence.find((e) => e.id === claim.id)
        ?.eligible,
    ).toBe(false);
    expect(
      (await database.select().from(schema.catalogAuditTable)).some(
        (a) => a.event === 'compatibility_record_revoked',
      ),
    ).toBe(true);
  });
  it('expires evidence at its boundary without a write or forced refresh', async () => {
    const initial = Date.now();
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(initial);
    try {
      await service.addEvidence('curator', {
        ...evidenceInput(),
        expiresAt: new Date(initial + 1000),
      });
      expect(
        (await service.report('owner', workspaceId)).report?.entries[0].state,
      ).toBe('conflicting-evidence');
      vi.setSystemTime(initial + 2000);
      expect(
        (await service.report('owner', workspaceId)).report?.entries[0].state,
      ).toBe('compatible');
      expect(calls).toBe(2);
    } finally {
      vi.useRealTimers();
    }
  });
  it('loads scoped relationships and preserves them across canonical project merges', async () => {
    const dep = await catalog.manual('curator', {
      ...catalogFixture().metadata,
      name: 'Required Bridge',
      url: 'https://example.test/bridge',
      reason: 'Verified dependency project fixture',
    });
    const relationship = await service.addRelationship('curator', {
      ...evidenceInput(),
      fromProjectId: projectId,
      toProjectId: dep.id,
      fromVersionId: versionId,
      toVersionId: null,
      versionRange: '>=2.0',
      kind: 'required',
    });
    expect(
      (await service.report('owner', workspaceId)).report?.findings.some(
        (f) => f.state === 'missing' && f.targetProjectId === dep.id,
      ),
    ).toBe(true);
    const depEntry = (await stacks.add('owner', workspaceId, dep.id, {
      versionSource: 'manual',
      manualVersion: '1.0',
    }))!;
    expect(
      (await service.report('owner', workspaceId)).report?.findings.some(
        (f) => f.state === 'incompatible' && f.targetEntryId === depEntry.id,
      ),
    ).toBe(true);
    const target = await catalog.manual('curator', {
      ...catalogFixture().metadata,
      name: 'Canonical Permissions',
      url: 'https://example.test/canonical',
      reason: 'Verified canonical target fixture',
    });
    await catalog.merge('curator', {
      from: projectId,
      into: target.id,
      reason: 'Verified canonical project identity',
    });
    expect(
      (
        await database
          .select()
          .from(schema.compatibilityRelationshipTable)
          .where(eq(schema.compatibilityRelationshipTable.id, relationship.id))
      )[0].fromProjectId,
    ).toBe(target.id);
    expect(
      (await service.report('owner', workspaceId)).report?.findings.some(
        (f) => f.state === 'incompatible' && f.targetEntryId === depEntry.id,
      ),
    ).toBe(true);
  });
});

describe('opted-in community evidence', () => {
  async function submitAs(actor: string) {
    const w = await workspaces.create(actor, runtime);
    const e = (await stacks.add(actor, w.id, projectId, {
      versionSource: 'catalog',
      versionId,
    }))!;
    return service.submitCommunity(actor, w.id, e.id, reportInput());
  }
  it('enforces opt-in, account age, workspace permissions, exact enabled releases and no self-review', async () => {
    await expect(
      service.submitCommunity('owner', workspaceId, entryId, {
        ...reportInput(),
        consent: false,
      }),
    ).rejects.toThrow();
    await expect(
      service.submitCommunity('outsider', workspaceId, entryId, reportInput()),
    ).rejects.toThrow();
    await expect(submitAs('new')).rejects.toThrow('seven days');
    await stacks.setVersion('owner', workspaceId, entryId, {
      versionSource: 'manual',
      manualVersion: '1.0',
    });
    await expect(
      service.submitCommunity('owner', workspaceId, entryId, reportInput()),
    ).rejects.toThrow('exact catalog');
    const self = await submitAs('curator');
    await expect(
      service.reviewCommunity(
        'curator',
        self.id,
        true,
        'Reviewed first hand report',
      ),
    ).rejects.toThrow('own report');
  });
  it('requires three independent approved reports, never overrides declarations, and excludes withdrawal/bans', async () => {
    const reportIds: string[] = [];
    for (const actor of ['reporter1', 'reporter2', 'reporter3']) {
      const r = await submitAs(actor);
      reportIds.push(r.id);
      expect(
        (await service.report('owner', workspaceId)).report?.entries[0].state,
      ).toBe('compatible');
    }
    for (const id of reportIds.slice(0, 2))
      await service.reviewCommunity(
        'curator',
        id,
        true,
        'Verified exact release and credible reproduction',
      );
    expect(
      (await service.report('owner', workspaceId)).report?.entries[0].state,
    ).toBe('compatible');
    await service.reviewCommunity(
      'curator',
      reportIds[2],
      true,
      'Verified exact release and credible reproduction',
    );
    const report = await service.report('owner', workspaceId);
    expect(report.report?.entries[0].state).toBe('conflicting-evidence');
    expect(JSON.stringify(report.report)).not.toContain('startup failure');
    await database
      .update(schema.userTable)
      .set({ banned: true })
      .where(eq(schema.userTable.id, 'reporter3'));
    expect(
      (await service.report('owner', workspaceId)).report?.entries[0].state,
    ).toBe('compatible');
    await database
      .update(schema.userTable)
      .set({ banned: false })
      .where(eq(schema.userTable.id, 'reporter3'));
    expect(
      (await service.report('owner', workspaceId)).report?.entries[0].state,
    ).toBe('conflicting-evidence');
    await expect(
      service.withdrawCommunity('owner', reportIds[0]),
    ).rejects.toThrow('not found');
    await service.withdrawCommunity('reporter1', reportIds[0]);
    expect(
      (await service.report('owner', workspaceId)).report?.entries[0].state,
    ).toBe('compatible');
    expect((await service.myReports('reporter1')).rows[0].report).toMatchObject(
      { status: 'withdrawn', detail: '' },
    );
    expect((await service.myReports('owner')).rows).toHaveLength(0);
  });
  it('rejects a report from a form whose runtime changed', async () => {
    await expect(
      service.submitCommunity('owner', workspaceId, entryId, {
        ...reportInput(),
        minecraftVersion: '1.20.1',
      }),
    ).rejects.toThrow('runtime changed');
    expect((await service.myReports('owner')).rows).toHaveLength(0);
  });
  it('limits duplicate and daily submissions using server submission times', async () => {
    await service.submitCommunity('owner', workspaceId, entryId, reportInput());
    await expect(
      service.submitCommunity('owner', workspaceId, entryId, reportInput()),
    ).rejects.toThrow('24 hours');
    const [v] = await database
      .select()
      .from(schema.catalogVersionTable)
      .where(eq(schema.catalogVersionTable.id, versionId));
    for (let i = 0; i < 5; i++) {
      const [next] = await database
        .insert(schema.catalogVersionTable)
        .values({ ...v, id: undefined, externalId: `extra-${i}` })
        .returning();
      await stacks.setVersion('owner', workspaceId, entryId, {
        versionSource: 'catalog',
        versionId: next.id,
      });
      const attempt = service.submitCommunity('owner', workspaceId, entryId, {
        ...reportInput(),
        versionId: next.id,
        observedAt: new Date(Date.now() - 30 * day),
      });
      if (i === 4) await expect(attempt).rejects.toThrow('five reports');
      else await attempt;
    }
  });
});
