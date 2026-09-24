import { describe, expect, it } from 'vitest';

import {
  matchesVersionRange,
  resolveCompatibility,
} from '@/features/workspaces/services/compatibility-engine';

import type {
  CompatibilityEntry,
  CompatibilitySnapshot,
  CuratedRelationship,
  EvidenceClaim,
} from '@/features/workspaces/schemas/compatibility-types';

const now = new Date('2026-09-24T12:00:00Z');
const claim = (
  result: 'compatible' | 'incompatible',
  extra: Partial<EvidenceClaim> = {},
): EvidenceClaim => ({
  id: result,
  kind: 'manual-curation',
  result,
  confidence: 'high',
  provenance: 'Reviewed publisher evidence',
  url: 'https://example.test/evidence',
  observedAt: '2026-09-20T00:00:00Z',
  expiresAt: '2026-10-20T00:00:00Z',
  eligible: true,
  detail: 'fixture',
  ...extra,
});
const plugin = (
  id: string,
  extra: Partial<CompatibilityEntry> = {},
): CompatibilityEntry => ({
  id,
  projectId: id,
  name: id,
  slug: id,
  enabled: true,
  versionId: `${id}-v1`,
  versionName: 'Release 1.0',
  versionNumber: '1.0',
  provider: 'modrinth',
  sourceUrl: `https://example.test/${id}`,
  sourceSyncedAt: '2026-09-24T00:00:00Z',
  sourceStatus: 'ok',
  available: true,
  support: [{ platform: 'paper', kind: 'minecraft', versions: ['1.21.11'] }],
  dependencies: [],
  evidence: [],
  ...extra,
});
const snapshot = (
  entries: CompatibilityEntry[],
  relationships: CuratedRelationship[] = [],
): CompatibilitySnapshot => ({
  platform: 'paper',
  minecraftVersion: '1.21.11',
  entries,
  projects: ['a', 'b', 'c'].map((id) => ({
    provider: 'modrinth',
    externalId: id,
    projectId: id,
    name: id,
    url: `https://example.test/${id}`,
  })),
  versions: [
    {
      provider: 'modrinth',
      externalId: 'b-v2',
      projectId: 'b',
      name: 'b',
      versionId: 'b-v2',
      url: 'https://example.test/b/2',
    },
  ],
  relationships,
});
const relation = (
  kind: CuratedRelationship['kind'],
  extra: Partial<CuratedRelationship> = {},
): CuratedRelationship => ({
  id: kind,
  fromProjectId: 'a',
  toProjectId: 'b',
  fromVersionId: null,
  toVersionId: null,
  kind,
  versionRange: null,
  platform: null,
  minecraftVersion: null,
  provenance: 'Reviewed relationship documentation',
  url: 'https://example.test/relation',
  observedAt: '2026-09-20T00:00:00Z',
  expiresAt: '2026-10-20T00:00:00Z',
  ...extra,
});
const dep = (
  id: string,
  type = 'required',
  sourceVersionId: string | null = null,
) => ({ sourceProjectId: id, sourceVersionId, name: id, type, platform: null });

describe('evidence-backed runtime states', () => {
  it('supports exact declarations, preserves unknown metadata and never equates proxy versions', () => {
    const report = resolveCompatibility(
      snapshot([
        plugin('a'),
        plugin('b', { support: [] }),
        plugin('c', {
          support: [
            { platform: 'velocity', kind: 'platform', versions: ['1.21.11'] },
          ],
        }),
        plugin('d', {
          support: [
            { platform: 'paper', kind: 'minecraft', versions: ['1.20.6'] },
          ],
        }),
      ]),
      now,
    );
    expect(report.entries.map((e) => e.state)).toEqual([
      'compatible',
      'unknown',
      'unknown',
      'incompatible',
    ]);
    expect(report.entries[0].evidence[0].url).toBe('https://example.test/a');
  });
  it('coexists with conflicting evidence and excludes expired/revoked/low-confidence claims', () => {
    expect(
      resolveCompatibility(
        snapshot([plugin('a', { evidence: [claim('incompatible')] })]),
        now,
      ).entries[0].state,
    ).toBe('conflicting-evidence');
    for (const extra of [
      { expiresAt: '2026-09-01T00:00:00Z' },
      { eligible: false },
      { confidence: 'low' as const },
    ])
      expect(
        resolveCompatibility(
          snapshot([plugin('a', { evidence: [claim('incompatible', extra)] })]),
          now,
        ).entries[0].state,
      ).toBe('compatible');
    expect(
      resolveCompatibility(
        snapshot([
          plugin('a', {
            evidence: [claim('incompatible', { kind: 'community-tested' })],
          }),
        ]),
        now,
      ).entries[0].state,
    ).toBe('conflicting-evidence');
  });
  it('requires selected exact versions and current sources; disabled entries never satisfy dependencies', () => {
    const report = resolveCompatibility(
      snapshot([
        plugin('a', { sourceSyncedAt: '2026-01-01T00:00:00Z' }),
        plugin('b', {
          versionId: null,
          versionNumber: '1.0',
          evidence: [claim('compatible')],
        }),
        plugin('c', { enabled: false }),
        plugin('d', { available: false }),
      ]),
      now,
    );
    expect(report.entries.every((e) => e.state === 'unknown')).toBe(true);
    expect(report.summary.unknown).toBe(3);
    expect(report.findings.some((f) => f.fromEntryId === 'c')).toBe(false);
  });
});

describe('deterministic dependency graphs', () => {
  it('separates missing required, optional and unresolved identities without name guessing', () => {
    const report = resolveCompatibility(
      snapshot([
        plugin('a', {
          dependencies: [dep('b'), dep('c', 'optional'), dep('not-in-catalog')],
        }),
      ]),
      now,
    );
    expect(
      report.findings.find((f) => f.targetProjectId === 'b'),
    ).toMatchObject({
      state: 'missing',
      fromEntryId: 'a',
      targetProjectId: 'b',
      suggestedUrl: 'https://example.test/b',
    });
    expect(report.findings.find((f) => f.targetProjectId === 'c')?.state).toBe(
      'optional-missing',
    );
    expect(report.findings.find((f) => f.targetProjectId === null)?.state).toBe(
      'unknown',
    );
    expect(report.summary.blocked).toBe(1);
  });
  it('checks exact dependency releases and preserves unknown installed releases', () => {
    const a = plugin('a', { dependencies: [dep('b', 'required', 'b-v2')] });
    expect(
      resolveCompatibility(snapshot([a, plugin('b')]), now).findings[0],
    ).toMatchObject({
      state: 'incompatible',
      requiredVersionId: 'b-v2',
      suggestedUrl: 'https://example.test/b/2',
    });
    expect(
      resolveCompatibility(
        snapshot([a, plugin('b', { versionId: null })]),
        now,
      ).findings.find((f) => f.fromEntryId === 'a')?.state,
    ).toBe('unknown');
    expect(
      resolveCompatibility(
        snapshot([a, plugin('b', { versionId: 'b-v2' })]),
        now,
      ).findings[0].state,
    ).toBe('satisfied');
  });
  it('keeps optional version mismatches informational and unknown ranges non-failing', () => {
    const entries = [plugin('a'), plugin('b')];
    expect(
      resolveCompatibility(
        snapshot(entries, [
          relation('required', { versionRange: '>=2.0 <3.0' }),
        ]),
        now,
      ).summary.blocked,
    ).toBe(1);
    const optional = resolveCompatibility(
      snapshot(entries, [relation('optional', { versionRange: '>=2.0' })]),
      now,
    );
    expect(optional.findings[0].state).toBe('incompatible');
    expect(optional.summary.blocked).toBe(0);
    expect(
      resolveCompatibility(
        snapshot(entries, [relation('required', { versionRange: '^banana' })]),
        now,
      ).findings[0].state,
    ).toBe('unknown');
  });
  it('scopes conflicts and overlaps without promoting overlap into failure', () => {
    const entries = [plugin('a'), plugin('b')];
    const report = resolveCompatibility(
      snapshot(entries, [relation('conflict'), relation('overlap')]),
      now,
    );
    expect(report.summary.blocked).toBe(1);
    expect(report.findings.map((f) => f.state)).toEqual([
      'conflict',
      'overlap',
    ]);
    expect(
      resolveCompatibility(
        snapshot(entries, [relation('conflict', { platform: 'velocity' })]),
        now,
      ).findings,
    ).toHaveLength(0);
    expect(
      resolveCompatibility(
        snapshot(entries, [relation('conflict', { toVersionId: 'b-v2' })]),
        now,
      ).summary.blocked,
    ).toBe(0);
    expect(
      resolveCompatibility(
        snapshot(
          [plugin('a'), plugin('b', { enabled: false })],
          [relation('conflict')],
        ),
        now,
      ).summary.blocked,
    ).toBe(0);
    expect(
      resolveCompatibility(
        snapshot(entries, [
          relation('conflict', { expiresAt: '2026-01-01T00:00:00Z' }),
        ]),
        now,
      ).findings[0].state,
    ).toBe('unknown');
  });
  it('detects hard/optional cycles and returns identical output after input reordering', () => {
    const entries = [
      plugin('a', { dependencies: [dep('b'), dep('c', 'optional')] }),
      plugin('b', { dependencies: [dep('a', 'optional')] }),
      plugin('c'),
    ];
    const first = snapshot(entries);
    const second = snapshot([...entries].reverse());
    expect(resolveCompatibility(first, now)).toEqual(
      resolveCompatibility(second, now),
    );
    expect(resolveCompatibility(first, now).cycles).toEqual([['a', 'b']]);
    expect(
      resolveCompatibility(
        snapshot([plugin('a', { dependencies: [dep('a')] })]),
        now,
      ).cycles,
    ).toEqual([['a']]);
  });
  it('handles a deep graph without recursive stack overflow', () => {
    const ids = Array.from({ length: 2000 }, (_, i) =>
      String(i).padStart(4, '0'),
    );
    const data = snapshot(
      ids.map((id, i) =>
        plugin(id, { dependencies: [dep(ids[(i + 1) % ids.length])] }),
      ),
    );
    data.projects = ids.map((id) => ({
      provider: 'modrinth',
      externalId: id,
      projectId: id,
      name: id,
      url: `https://example.test/${id}`,
    }));
    const report = resolveCompatibility(data, now);
    expect(report.cycles).toHaveLength(1);
    expect(report.cycles[0]).toHaveLength(2000);
  });
  it('does not treat bundled dependencies or unknown types as required missing plugins', () => {
    const report = resolveCompatibility(
      snapshot([
        plugin('a', {
          dependencies: [dep('b', 'embedded'), dep('c', 'future-kind')],
        }),
      ]),
      now,
    );
    expect(report.summary.blocked).toBe(0);
    expect(report.findings.find((f) => f.kind === 'embedded')?.state).toBe(
      'satisfied',
    );
  });
});

it('compares only documented numeric range syntax', () => {
  expect(matchesVersionRange('1.2.3', '>=1.0 <2.0')).toBe(true);
  expect(matchesVersionRange('2.0', '>=1.0 <2.0')).toBe(false);
  expect(matchesVersionRange('1.2', '=1.2.0')).toBe(true);
  for (const [version, range] of [
    ['build 1.2', '>=1.0'],
    ['1.2-rc1', '<2.0'],
    ['1.2', '^1.0'],
    ['1.2', 'banana'],
    [null, '>=1.0'],
    ['1.0', null],
  ])
    expect(matchesVersionRange(version, range)).toBeNull();
});
