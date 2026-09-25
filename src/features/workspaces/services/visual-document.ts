import { Document, isMap, isScalar, isSeq, parseDocument } from 'yaml';

import { inspectConfig } from '@/features/workspaces/services/config-yaml';

import type {
  ConfigValue,
  FieldSchema,
  VisualSchema,
} from '@/features/workspaces/schemas/visual-schema';

export type FieldPath = (string | number)[];
export type FieldIssue = {
  path: FieldPath;
  severity: 'error' | 'warning';
  message: string;
};
export function visualDocument(text: string) {
  const inspected = inspectConfig(text);
  if (!inspected.valid)
    throw new Error(inspected.diagnostics[0]?.message ?? 'Invalid YAML.');
  return parseDocument(text, {
    version: '1.2',
    schema: 'core',
    customTags: [],
    resolveKnownTags: false,
    stringKeys: true,
    uniqueKeys: true,
    intAsBigInt: true,
  });
}
export function nodeValue(node: unknown): ConfigValue | undefined {
  if (isScalar(node))
    return typeof node.value === 'bigint' ?
        Number(node.value)
      : (node.value as ConfigValue);
  if (isSeq(node)) return node.items.map((item) => nodeValue(item) ?? null);
  if (isMap(node))
    return Object.fromEntries(
      node.items.map((p) => [
        String(isScalar(p.key) ? p.key.value : p.key),
        nodeValue(p.value) ?? null,
      ]),
    );
  return undefined;
}
export function valueAt(
  root: ConfigValue | undefined,
  path: FieldPath,
): ConfigValue | undefined {
  let value = root;
  for (const key of path) {
    if (
      value === null ||
      typeof value !== 'object' ||
      !Object.hasOwn(value, key)
    )
      return undefined;
    value = (value as Record<string, ConfigValue>)[key];
  }
  return value;
}
export function visible(field: FieldSchema, root: ConfigValue | undefined) {
  return (
    !field.visibleWhen ||
    valueAt(root, field.visibleWhen.path) === field.visibleWhen.equals
  );
}
export function fieldIssues(
  field: FieldSchema,
  value: ConfigValue | undefined,
  path: FieldPath = [],
  root: ConfigValue | undefined = value,
): FieldIssue[] {
  const out: FieldIssue[] = [];
  const add = (message: string, severity: 'error' | 'warning' = 'error') =>
    out.push({ path, severity, message });
  if (!visible(field, root)) return out;
  if (value === undefined) {
    if (field.required) add('Required setting is missing.');
    return out;
  }
  const object =
    value !== null && typeof value === 'object' && !Array.isArray(value);
  const valid =
    field.type === 'object' || field.type === 'map' ? object
    : field.type === 'list' ? Array.isArray(value)
    : field.type === 'enum' ? field.options?.some((o) => o === value)
    : field.type === 'scalar' ?
      value === null || ['string', 'number', 'boolean'].includes(typeof value)
    : typeof value === field.type;
  if (!valid) {
    add(`Expected ${field.type}. Use YAML to repair this value or reset it.`);
    return out;
  }
  if (typeof value === 'number') {
    if (
      !Number.isFinite(value) ||
      (!Number.isSafeInteger(value) && Number.isInteger(value))
    )
      add('Use a finite, safely representable number.');
    if (field.integer && !Number.isInteger(value)) add('Use a whole number.');
    if (field.min !== undefined && value < field.min)
      add(`Minimum: ${field.min}.`);
    if (field.max !== undefined && value > field.max)
      add(`Maximum: ${field.max}.`);
    if (
      (field.recommendedMin !== undefined && value < field.recommendedMin) ||
      (field.recommendedMax !== undefined && value > field.recommendedMax)
    )
      add(
        `Recommended range: ${field.recommendedMin ?? 'no minimum'} to ${field.recommendedMax ?? 'no maximum'}.`,
        'warning',
      );
  }
  if (typeof value === 'string' || Array.isArray(value)) {
    if (field.minLength !== undefined && value.length < field.minLength)
      add(`Minimum length: ${field.minLength}.`);
    if (field.maxLength !== undefined && value.length > field.maxLength)
      add(`Maximum length: ${field.maxLength}.`);
  }
  if (field.type === 'object' && object)
    for (const child of field.fields ?? [])
      out.push(
        ...fieldIssues(
          child,
          Object.hasOwn(value, child.key) ? value[child.key] : undefined,
          [...path, child.key],
          root,
        ),
      );
  if (field.type === 'list' && Array.isArray(value))
    value.forEach((v, i) =>
      out.push(...fieldIssues(field.items!, v, [...path, i], root)),
    );
  if (field.type === 'map' && object)
    for (const [k, v] of Object.entries(value)) {
      if (!validMapKey(k, field.keyMode))
        out.push({
          path: [...path, k],
          severity: 'error',
          message: 'Invalid map key. Rename it or use YAML.',
        });
      out.push(...fieldIssues(field.items!, v, [...path, k], root));
    }
  // Keep blocking errors ahead of advisory warnings when bounding diagnostics.
  return out
    .sort(
      (a, b) =>
        Number(a.severity === 'warning') - Number(b.severity === 'warning'),
    )
    .slice(0, 300);
}
export function validMapKey(key: string, mode = 'identifier') {
  return (
    key.length > 0 &&
    key.length <= 120 &&
    !['__proto__', 'prototype', 'constructor'].includes(key) &&
    !/[\x00-\x1f]/.test(key) &&
    (mode === 'text' || /^[a-zA-Z0-9_.-]+$/.test(key))
  );
}
export function fieldDefault(field: FieldSchema): ConfigValue | undefined {
  if (field.default !== undefined) return structuredClone(field.default);
  if (field.type === 'object') {
    const entries = (field.fields ?? [])
      .map((f) => [f.key, fieldDefault(f)] as const)
      .filter(([, v]) => v !== undefined);
    return Object.fromEntries(entries) as ConfigValue;
  }
  return undefined;
}
export function templateDocument(schema: VisualSchema) {
  const value = fieldDefault(schema.root);
  const errors = fieldIssues(schema.root, value).filter(
    (i) => i.severity === 'error',
  );
  if (errors.length)
    throw new Error(
      `Defaults are incomplete: ${errors[0].path.join('.')}: ${errors[0].message}`,
    );
  const text = new Document(value).toString({ lineWidth: 0 });
  visualDocument(text);
  return text;
}
export type VisualEdit =
  | { type: 'set'; path: FieldPath; value: ConfigValue }
  | { type: 'remove'; path: FieldPath }
  | { type: 'move'; path: FieldPath; from: number; to: number }
  | {
      type: 'rename';
      path: FieldPath;
      from: string;
      to: string;
      keyMode?: string;
    }
  | { type: 'append'; path: FieldPath; value: ConfigValue }
  | { type: 'reset'; path: FieldPath; field: FieldSchema };
export function editVisual(text: string, edit: VisualEdit) {
  const doc: Document = visualDocument(text);
  const set = (path: FieldPath, value: ConfigValue) => {
    if (!path.length) {
      doc.contents = doc.createNode(value);
      return;
    }
    for (let i = 1; i < path.length; i++) {
      const p = path.slice(0, i);
      const n = doc.getIn(p, true);
      if (n === undefined) doc.setIn(p, typeof path[i] === 'number' ? [] : {});
      else if (!isMap(n) && !isSeq(n))
        throw new Error('Repair the parent value in YAML first.');
    }
    doc.setIn(path, value);
  };
  if (edit.type === 'set') set(edit.path, edit.value);
  if (edit.type === 'remove') doc.deleteIn(edit.path);
  if (edit.type === 'append') {
    const list = doc.getIn(edit.path, true);
    if (!isSeq(list)) throw new Error('Expected a list.');
    list.items.push(doc.createNode(edit.value));
  }
  if (edit.type === 'move') {
    const list = doc.getIn(edit.path, true);
    if (
      !isSeq(list) ||
      ![edit.from, edit.to].every(
        (i) => Number.isInteger(i) && i >= 0 && i < list.items.length,
      )
    )
      throw new Error('Invalid list position.');
    const [node] = list.items.splice(edit.from, 1);
    list.items.splice(edit.to, 0, node);
  }
  if (edit.type === 'rename') {
    const map = doc.getIn(edit.path, true);
    if (
      !isMap(map) ||
      !validMapKey(edit.to, edit.keyMode) ||
      (edit.from !== edit.to && map.has(edit.to))
    )
      throw new Error('Use a valid, unique map key.');
    const pair = map.items.find(
      (p) => isScalar(p.key) && p.key.value === edit.from,
    );
    if (!pair || !isScalar(pair.key)) throw new Error('Map key not found.');
    pair.key.value = edit.to;
  }
  if (edit.type === 'reset') {
    const reset = (field: FieldSchema, path: FieldPath) => {
      const current = doc.getIn(path, true);
      if (field.type === 'object' && isMap(current)) {
        const defaults = field.default;
        for (const child of field.fields ?? []) {
          const override =
            (
              defaults &&
              typeof defaults === 'object' &&
              !Array.isArray(defaults) &&
              Object.hasOwn(defaults, child.key)
            ) ?
              { ...child, default: defaults[child.key] }
            : child;
          if (fieldDefault(override) !== undefined)
            reset(override, [...path, child.key]);
        }
      } else {
        const value = fieldDefault(field);
        if (value !== undefined) set(path, value);
      }
    };
    reset(edit.field, edit.path);
  }
  const result = doc.toString({ lineWidth: 0 });
  visualDocument(result);
  return result;
}
