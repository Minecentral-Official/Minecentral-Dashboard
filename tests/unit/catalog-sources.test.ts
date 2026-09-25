import { describe, expect, it } from 'vitest';

import {
  parseCatalogFilters,
  safeUrl,
  sourceInput,
} from '@/features/catalog/schemas/catalog-input';
import {
  createSourceClient,
  SourceError,
} from '@/features/catalog/services/source-client';

const project = {
  id: 'oak12345',
  slug: 'oak',
  title: 'Oak',
  description: 'Permissions',
  status: 'approved',
  team: 'team1',
  versions: ['v1'],
  loaders: ['paper', 'fabric'],
  categories: ['utility'],
  icon_url: null,
  issues_url: null,
  source_url: 'https://example.test/code',
  wiki_url: null,
};
const release = {
  id: 'v1',
  project_id: 'oak12345',
  name: '1.0',
  version_type: 'release',
  date_published: '2026-01-01T00:00:00Z',
  loaders: ['paper', 'fabric'],
  game_versions: ['1.21.11'],
  status: 'listed',
  dependencies: [
    {
      project_id: 'dep1',
      version_id: null,
      file_name: null,
      dependency_type: 'required',
    },
  ],
};
const hp = {
  id: 42,
  name: 'Oak',
  namespace: { owner: 'Team', slug: 'Oak' },
  description: 'Permissions',
  visibility: 'public',
  category: 'utility',
  avatarUrl: null,
  supportedPlatforms: { PAPER: ['1.21.11'], VELOCITY: ['3.4'] },
  settings: { links: [], unlisted: false },
};
const hv = {
  id: 7,
  projectId: 42,
  name: '1.0',
  createdAt: '2026-01-01T00:00:00Z',
  visibility: 'public',
  channel: { name: 'Release' },
  platformDependencies: { PAPER: ['1.21.11'], VELOCITY: ['3.4'] },
  pluginDependencies: {
    PAPER: [
      { name: 'Bridge', projectId: 5, required: false, platform: 'PAPER' },
    ],
  },
};
const response = (data: unknown) =>
  new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
const nop = async () => {};
describe('source normalization and boundaries', () => {
  it('maps Modrinth IDs, authors, dependencies and server-only loaders', async () => {
    const paths: string[] = [];
    const client = createSourceClient(async (input, init) => {
      paths.push(String(input));
      expect(init?.redirect).toBe('error');
      expect(init?.headers).toHaveProperty('User-Agent');
      return response(
        paths.length === 1 ? project
        : paths.length === 2 ? [{ user: { username: 'Author' } }]
        : [release],
      );
    }, nop);
    const snap = await client.snapshot('modrinth', 'oak');
    expect(snap.externalId).toBe('oak12345');
    expect(snap.metadata.platforms).toEqual(['paper']);
    expect(snap.metadata.authors).toEqual(['Author']);
    expect(snap.versions[0].support).toEqual([
      { platform: 'paper', kind: 'minecraft', versions: ['1.21.11'] },
    ]);
    expect(snap.versions[0].dependencies[0].sourceProjectId).toBe('dep1');
    expect(paths[2]).toContain('/versions?ids=');
  });
  it('paginates Hangar and keeps proxy platform support distinct', async () => {
    let count = 0;
    const urls: string[] = [];
    const client = createSourceClient(async (input) => {
      urls.push(String(input));
      count++;
      return response(
        count === 1 ? hp
        : count === 2 ?
          {
            pagination: { count: 26 },
            result: Array.from({ length: 25 }, (_, id) => ({ ...hv, id })),
          }
        : { pagination: { count: 26 }, result: [{ ...hv, id: 26 }] },
      );
    }, nop);
    const snap = await client.snapshot('hangar', 'Team/Oak');
    expect(snap.versions).toHaveLength(26);
    expect(urls[2]).toContain('offset=25');
    expect(snap.versions[0].support[1]).toEqual({
      platform: 'velocity',
      kind: 'platform',
      versions: ['3.4'],
    });
    expect(snap.externalId).toBe('42');
  });
  it('treats 404 as unavailable and honors rate-limit retry headers without leaking response bodies', async () => {
    for (const status of [404, 429, 503]) {
      const client = createSourceClient(
        async () =>
          new Response('private upstream text', {
            status,
            headers: { 'Retry-After': '120' },
          }),
        nop,
      );
      await expect(client.snapshot('modrinth', 'oak')).rejects.toMatchObject({
        status,
        retryAfter: 120,
        message: `Source HTTP ${status}`,
      });
    }
  });
  it('rejects unrelated releases and malformed metadata before persistence', async () => {
    let calls = 0;
    const client = createSourceClient(
      async () =>
        response(
          ++calls === 1 ? project
          : calls === 2 ? []
          : [{ ...release, project_id: 'other' }],
        ),
      nop,
    );
    await expect(client.snapshot('modrinth', 'oak')).rejects.toBeInstanceOf(
      SourceError,
    );
    await expect(
      createSourceClient(
        async () => response({ ...hp, visibility: 'hidden' }),
        nop,
      ).snapshot('hangar', '42'),
    ).rejects.toMatchObject({ status: 404 });
    expect(
      sourceInput.safeParse({
        provider: 'hangar',
        locator: 'https://localhost/private',
      }).success,
    ).toBe(false);
    expect(safeUrl.safeParse('javascript:alert(1)').success).toBe(false);
    expect(
      safeUrl.safeParse('https://user:password@example.test').success,
    ).toBe(false);
  });
  it('normalizes shareable filters without accepting arbitrary sort or unbounded pages', () => {
    expect(
      parseCatalogFilters({
        platform: ['paper', 'invalid', 'paper'],
        page: '-1',
        sort: 'sql',
        limit: '999',
      }),
    ).toMatchObject({ platform: ['paper'], page: 1, sort: 'name', limit: 24 });
  });
});
