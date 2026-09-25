import { describe, expect, it } from 'vitest';

import {
  CONFIG_MAX_BYTES,
  configPath,
} from '@/features/workspaces/schemas/config-input';
import { configDiff } from '@/features/workspaces/services/config-diff';
import {
  inspectConfig,
  serializeConfig,
} from '@/features/workspaces/services/config-yaml';

describe('lossless private YAML validation', () => {
  it('preserves comments, key order, quoted strings, unknown keys and CRLF exactly', () => {
    const text =
      '# operator note\r\nsettings:\r\n  allow-end: true # comment\r\nunknown-plugin-key: "001"\r\nmessage: |\r\n  Hello <script>\r\n  world\r\n__proto__:\r\n  enabled: true\r\n';
    expect(inspectConfig(text).valid).toBe(true);
    expect(serializeConfig(text)).toBe(text);
    expect({}).not.toHaveProperty('enabled');
  });
  it('returns line/column diagnostics for broken syntax and duplicate keys', () => {
    for (const text of ['settings: [true\n', 'a: 1\na: 2\n']) {
      const result = inspectConfig(text);
      expect(result.valid).toBe(false);
      expect(result.diagnostics[0]).toMatchObject({
        category: 'syntax',
        severity: 'error',
        line: expect.any(Number),
        column: expect.any(Number),
      });
      expect(() => serializeConfig(text)).toThrow();
    }
  });
  it.each([
    'run: !!js/function "function(){return 1}"',
    'x: !custom test',
    'x: !!binary aGVsbG8=',
    '%YAML 1.1\n---\nx: yes',
    'a: &a [*a]',
    'a: 1\n---\nb: 2',
    '- list\n- root',
    'x: \0',
  ])('rejects unsupported or unsafe constructs: %s', (text) => {
    expect(inspectConfig(text).valid).toBe(false);
  });
  it('bounds UTF-8 bytes and nested structures without expanding aliases', () => {
    expect(
      inspectConfig('x: ' + 'é'.repeat(CONFIG_MAX_BYTES / 2)).diagnostics[0]
        .category,
    ).toBe('limit');
    expect(
      inspectConfig('x: ' + '['.repeat(200) + '1' + ']'.repeat(200)).valid,
    ).toBe(false);
    expect(inspectConfig('a: &a [1,2]\nb: [*a,*a,*a]').valid).toBe(false);
    expect(inspectConfig('')).toMatchObject({ valid: false });
  });
  it('keeps optional schema warnings separate and does not drop unknown settings', () => {
    const text =
      'settings:\n  allow-end: "yes"\n  connection-throttle: slow\n  shutdown-message: 123\nunknown: keep\n';
    expect(inspectConfig(text)).toEqual({ valid: true, diagnostics: [] });
    const checked = inspectConfig(text, 'bukkit-basic');
    expect(checked.valid).toBe(true);
    expect(checked.diagnostics).toHaveLength(3);
    expect(
      checked.diagnostics.every(
        (d) => d.category === 'schema' && d.severity === 'warning',
      ),
    ).toBe(true);
    expect(serializeConfig(text, 'bukkit-basic')).toBe(text);
  });
  it('rejects unsafe download paths', () => {
    for (const path of [
      '../config.yml',
      '/config.yml',
      'x/../../config.yml',
      'bad\\config.yml',
      'config.yml\r\nX: header',
      'config.txt',
      'https://host/config.yml',
    ])
      expect(configPath.safeParse(path).success).toBe(false);
    expect(configPath.parse('plugins/My Plugin/config.yaml')).toBe(
      'plugins/My Plugin/config.yaml',
    );
  });
  it('provides bounded line-oriented diffs with line numbers and no HTML interpretation', () => {
    const diff = configDiff('a: 1\nb: 2\n', 'a: 1\nb: 3\n');
    expect(diff.rows).toContainEqual({
      kind: 'removed',
      text: 'b: 2',
      oldLine: 2,
      newLine: null,
    });
    expect(diff.rows).toContainEqual({
      kind: 'added',
      text: 'b: 3',
      oldLine: null,
      newLine: 2,
    });
    expect(configDiff('x', 'x').identical).toBe(true);
    expect(configDiff('a\n'.repeat(2000), 'b\n'.repeat(2000))).toMatchObject({
      truncated: true,
    });
  });
});
