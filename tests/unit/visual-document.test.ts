import { describe, expect, it } from 'vitest';

import { parseVisualSchema } from '@/features/workspaces/schemas/visual-schema';
import {
  editVisual,
  fieldIssues,
  nodeValue,
  templateDocument,
  visualDocument,
} from '@/features/workspaces/services/visual-document';
import { chooseSchema } from '@/features/workspaces/services/visual-schema-service';

import { visualSchemaFixture as schema } from '../fixtures/visual-schema';

const text =
  '# root comment\nenabled: true # inline\nmode: simple\nsettings:\n  timeout: 30\n  secret: "001" # unknown\nunknown: 900719925474099312345\nservers:\n  - name: lobby # keep with item\n    port: 25565\n  - name: survival\n    port: 25566\ngroups:\n  default: # keep group\n    prefix: Player\n    permissions: [build]\n';
const values = (s: string) => nodeValue(visualDocument(s).contents);
describe('visual schema format and constraints', () => {
  it('describes nested lists/maps, conditional help, defaults and typed scalars', () => {
    expect(parseVisualSchema(schema)).toEqual(schema);
    expect(fieldIssues(schema.root, values(templateDocument(schema)))).toEqual(
      [],
    );
  });
  it('rejects unknown schema vocabulary, unsafe keys, duplicate fields, depth and size abuse', () => {
    expect(() => parseVisualSchema({ ...schema, formatVersion: 2 })).toThrow();
    expect(() =>
      parseVisualSchema({
        ...schema,
        root: {
          ...schema.root,
          fields: [{ key: '__proto__', label: 'Bad', type: 'string' }],
        },
      }),
    ).toThrow();
    expect(() =>
      parseVisualSchema({
        ...schema,
        root: {
          ...schema.root,
          fields: [schema.root.fields![0], schema.root.fields![0]],
        },
      }),
    ).toThrow();
    let root = schema.root;
    for (let i = 0; i < 12; i++)
      root = { key: 'deep', label: 'Deep', type: 'object', fields: [root] };
    expect(() => parseVisualSchema({ ...schema, root })).toThrow();
    expect(() =>
      parseVisualSchema({ ...schema, title: 'a'.repeat(70000) }),
    ).toThrow();
  });
  it('separates recommended warnings from required/type/hard constraints and conditional visibility', () => {
    const root = values(templateDocument(schema)) as Record<string, unknown>;
    const timeout = schema.root.fields![3].fields![0];
    expect(fieldIssues(timeout, 70)).toMatchObject([{ severity: 'warning' }]);
    expect(fieldIssues(timeout, 2000).some((i) => i.severity === 'error')).toBe(
      true,
    );
    expect(fieldIssues(timeout, '30')[0].severity).toBe('error');
    expect(fieldIssues(schema.root.fields![0], undefined)[0].severity).toBe(
      'error',
    );
    root.settings = { timeout: 30, debug: 'wrong' };
    expect(
      fieldIssues(schema.root, root as never).some((i) =>
        i.path.includes('debug'),
      ),
    ).toBe(false);
    root.mode = 'advanced';
    expect(
      fieldIssues(schema.root, root as never).some((i) =>
        i.path.includes('debug'),
      ),
    ).toBe(true);
  });
});
describe('full-document edits', () => {
  it('preserves unknown values, large integers, quotes and comments while changing a known scalar', () => {
    const result = editVisual(text, {
      type: 'set',
      path: ['settings', 'timeout'],
      value: 45,
    });
    expect(result).toContain('900719925474099312345');
    expect(result).toContain('secret: "001" # unknown');
    expect(result).toContain('# root comment');
    expect(result).toContain('# inline');
    expect(result).toContain('timeout: 45');
  });
  it('moves whole list nodes including comments and persists typed nested edits', () => {
    let result = editVisual(text, {
      type: 'move',
      path: ['servers'],
      from: 0,
      to: 1,
    });
    result = editVisual(result, {
      type: 'set',
      path: ['servers', 0, 'port'],
      value: 25570,
    });
    expect((values(result) as Record<string, unknown>).servers).toEqual([
      { name: 'survival', port: 25570 },
      { name: 'lobby', port: 25565 },
    ]);
    expect(result).toContain('# keep with item');
    result = editVisual(result, {
      type: 'append',
      path: ['servers'],
      value: { name: 'extra', port: 25580 },
    });
    expect((values(result) as Record<string, unknown[]>).servers).toHaveLength(
      3,
    );
    result = editVisual(result, { type: 'remove', path: ['servers', 2] });
    expect((values(result) as Record<string, unknown[]>).servers).toHaveLength(
      2,
    );
  });
  it('renames map keys without dropping nested unknown content and rejects duplicates/invalid keys', () => {
    const result = editVisual(text, {
      type: 'rename',
      path: ['groups'],
      from: 'default',
      to: 'member',
    });
    expect(result).toContain('member:');
    expect(result).toContain('# keep group');
    expect(result).toContain('permissions: [ build ]');
    expect(() =>
      editVisual(text, {
        type: 'rename',
        path: ['groups'],
        from: 'default',
        to: '__proto__',
      }),
    ).toThrow();
    const two = editVisual(text, {
      type: 'set',
      path: ['groups', 'staff'],
      value: { prefix: 'Staff' },
    });
    expect(() =>
      editVisual(two, {
        type: 'rename',
        path: ['groups'],
        from: 'default',
        to: 'staff',
      }),
    ).toThrow();
  });
  it('resets known section fields while retaining unknown keys and handles missing defaults', () => {
    const changed = editVisual(text, {
      type: 'set',
      path: ['settings', 'timeout'],
      value: 55,
    });
    const result = editVisual(changed, {
      type: 'reset',
      path: ['settings'],
      field: schema.root.fields![3],
    });
    expect(result).toContain('timeout: 30');
    expect(result).toContain('secret: "001"');
    const overridden = editVisual(changed, {
      type: 'reset',
      path: ['settings'],
      field: { ...schema.root.fields![3], default: { timeout: 45 } },
    });
    expect(overridden).toContain('timeout: 45');
    expect(overridden).toContain('secret: "001"');
    expect(() =>
      templateDocument({
        ...schema,
        root: {
          key: 'root',
          label: 'Root',
          type: 'object',
          fields: [
            {
              key: 'required',
              label: 'Required',
              type: 'string',
              required: true,
            },
          ],
        },
      }),
    ).toThrow('incomplete');
  });
  it('rejects invalid raw YAML and wrong parent structures without replacing text', () => {
    expect(() =>
      editVisual('broken: [', { type: 'set', path: ['enabled'], value: false }),
    ).toThrow();
    expect(() =>
      editVisual('settings: wrong', {
        type: 'set',
        path: ['settings', 'timeout'],
        value: 30,
      }),
    ).toThrow('parent');
    expect(text).toContain('# root comment');
  });
});
it('selects exact verified coverage before broad releases with stable tie breaking and explicit fallback', () => {
  const target = {
    kind: 'plugin',
    filename: 'config.yml',
    platform: 'paper',
    version: '1.0',
  };
  const broad = {
    id: 'b',
    retired: false,
    definition: {
      ...schema,
      key: 'broad-schema',
      release: 9,
      provenance: { ...schema.provenance, verifiedVersion: '1.1' },
    },
  };
  const exact = { id: 'a', retired: false, definition: schema };
  expect(chooseSchema([broad, exact], target).releaseId).toBe('a');
  expect(chooseSchema([exact, broad], target)).toEqual(
    chooseSchema([broad, exact], target),
  );
  for (const extra of [
    { version: '2.0' },
    { version: null },
    { platform: 'velocity' },
    { filename: 'other.yml' },
  ])
    expect(chooseSchema([exact], { ...target, ...extra }).schema).toBeNull();
  expect(chooseSchema([{ ...exact, retired: true }], target).schema).toBeNull();
});

it('does not hide a late blocking error behind many recommendation warnings', () => {
  const field = {
    key: 'values',
    label: 'Values',
    type: 'list' as const,
    items: {
      key: 'value',
      label: 'Value',
      type: 'number' as const,
      max: 100,
      recommendedMax: 1,
    },
  };
  const issues = fieldIssues(field, [
    ...Array.from({ length: 400 }, () => 2),
    200,
  ]);
  expect(issues).toHaveLength(300);
  expect(issues[0]).toMatchObject({ severity: 'error', path: [400] });
});
