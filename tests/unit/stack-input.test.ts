import { describe, expect, it } from 'vitest';

import {
  declaredSupport,
  parseStackImport,
  versionInput,
} from '@/features/workspaces/schemas/stack-input';

describe('stack import and declared support', () => {
  it('accepts line lists and bounded manual-version manifests', () => {
    expect(
      parseStackImport('Oak Permissions\r\n\nhttps://example.test/plugin\n'),
    ).toEqual([
      { project: 'Oak Permissions' },
      { project: 'https://example.test/plugin' },
    ]);
    expect(
      parseStackImport('{"plugins":[{"project":"Oak","version":"custom-1"}]}'),
    ).toEqual([{ project: 'Oak', version: 'custom-1' }]);
    for (const text of [
      '',
      'x\n'.repeat(101),
      '{bad}',
      '{"plugins":[]}',
      '{"plugins":[{"project":"Oak","unknown":true}]}',
    ])
      expect(() => parseStackImport(text)).toThrow();
    expect(
      versionInput.safeParse({ versionSource: 'manual', manualVersion: '' })
        .success,
    ).toBe(false);
  });
  it('keeps missing metadata and proxy versions distinct from declared Minecraft support', () => {
    const runtime = { platform: 'paper', minecraftVersion: '1.21.11' };
    expect(declaredSupport([], runtime)).toBe('unknown');
    expect(
      declaredSupport(
        [{ platform: 'paper', kind: 'minecraft', versions: [] }],
        runtime,
      ),
    ).toBe('unknown');
    expect(
      declaredSupport(
        [{ platform: 'paper', kind: 'minecraft', versions: ['1.21.11'] }],
        runtime,
      ),
    ).toBe('declared');
    expect(
      declaredSupport(
        [{ platform: 'paper', kind: 'minecraft', versions: ['1.20.6'] }],
        runtime,
      ),
    ).toBe('unsupported');
    expect(
      declaredSupport(
        [{ platform: 'velocity', kind: 'platform', versions: ['1.21.11'] }],
        runtime,
      ),
    ).toBe('unsupported');
  });
});
