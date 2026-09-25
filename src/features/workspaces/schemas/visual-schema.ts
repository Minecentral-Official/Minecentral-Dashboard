import { z } from 'zod';

export type ScalarValue = string | number | boolean | null;
export type ConfigValue =
  | ScalarValue
  | ConfigValue[]
  | { [key: string]: ConfigValue };
export type FieldSchema = {
  key: string;
  label: string;
  type:
    | 'string'
    | 'number'
    | 'boolean'
    | 'enum'
    | 'scalar'
    | 'object'
    | 'list'
    | 'map';
  required?: boolean;
  default?: ConfigValue;
  description?: string;
  examples?: string[];
  unit?: string;
  caution?: string;
  link?: string;
  min?: number;
  max?: number;
  integer?: boolean;
  minLength?: number;
  maxLength?: number;
  recommendedMin?: number;
  recommendedMax?: number;
  options?: ScalarValue[];
  fields?: FieldSchema[];
  items?: FieldSchema;
  keyMode?: 'identifier' | 'text';
  visibleWhen?: { path: string[]; equals: ScalarValue };
};
export type VisualSchema = {
  formatVersion: 1;
  key: string;
  release: number;
  title: string;
  filename: string;
  target: { kind: 'plugin' | 'server'; versionRange: string; platform: string };
  provenance: {
    url: string;
    description: string;
    verifiedVersion: string;
    verifiedAt: string;
  };
  root: FieldSchema;
};
const text = z.string().max(2000);
const scalar = z.union([
  z.string().max(10000),
  z.number().finite(),
  z.boolean(),
  z.null(),
]);
const key = z
  .string()
  .min(1)
  .max(120)
  .refine(
    (v) =>
      !['__proto__', 'constructor', 'prototype'].includes(v) &&
      !/[\x00-\x1f]/.test(v),
    'Use a safe field key.',
  );
const json: z.ZodType<ConfigValue> = z.lazy(() =>
  z.union([scalar, z.array(json).max(200), z.record(json)]),
);
const field: z.ZodType<FieldSchema> = z.lazy(() =>
  z
    .object({
      key,
      label: z.string().min(1).max(160),
      type: z.enum([
        'string',
        'number',
        'boolean',
        'enum',
        'scalar',
        'object',
        'list',
        'map',
      ]),
      required: z.boolean().optional(),
      default: json.optional(),
      description: text.optional(),
      examples: z.array(text).max(5).optional(),
      unit: z.string().max(40).optional(),
      caution: text.optional(),
      link: z.string().url().startsWith('https://').optional(),
      min: z.number().finite().optional(),
      max: z.number().finite().optional(),
      integer: z.boolean().optional(),
      minLength: z.number().int().min(0).max(10000).optional(),
      maxLength: z.number().int().min(0).max(10000).optional(),
      recommendedMin: z.number().finite().optional(),
      recommendedMax: z.number().finite().optional(),
      options: z.array(scalar).min(1).max(100).optional(),
      fields: z.array(field).max(100).optional(),
      items: field.optional(),
      keyMode: z.enum(['identifier', 'text']).optional(),
      visibleWhen: z
        .object({ path: z.array(key).min(1).max(12), equals: scalar })
        .strict()
        .optional(),
    })
    .strict()
    .superRefine((v, ctx) => {
      const fail = (message: string) =>
        ctx.addIssue({ code: 'custom', message });
      if (v.type === 'object' && !v.fields) fail('Objects need fields.');
      if ((v.type === 'list' || v.type === 'map') && !v.items)
        fail('Lists and maps need an item schema.');
      if (v.type === 'enum' && !v.options) fail('Enums need options.');
      if (
        v.fields &&
        new Set(v.fields.map((f) => f.key)).size !== v.fields.length
      )
        fail('Field keys must be unique.');
      if (v.min !== undefined && v.max !== undefined && v.min > v.max)
        fail('Minimum exceeds maximum.');
      if (
        v.minLength !== undefined &&
        v.maxLength !== undefined &&
        v.minLength > v.maxLength
      )
        fail('Minimum length exceeds maximum.');
    }),
);
const definition = z
  .object({
    formatVersion: z.literal(1),
    key: z.string().regex(/^[a-z][a-z0-9-]{2,79}$/),
    release: z.number().int().positive(),
    title: z.string().min(1).max(160),
    filename: z
      .string()
      .regex(/^[a-zA-Z0-9_. -]+\.ya?ml$/i)
      .max(160),
    target: z
      .object({
        kind: z.enum(['plugin', 'server']),
        versionRange: z.string().min(1).max(200),
        platform: z.enum([
          'paper',
          'spigot',
          'bukkit',
          'purpur',
          'folia',
          'velocity',
          'bungeecord',
          'waterfall',
          'fabric',
          'forge',
          'neoforge',
        ]),
      })
      .strict(),
    provenance: z
      .object({
        url: z.string().url().startsWith('https://'),
        description: z.string().min(10).max(2000),
        verifiedVersion: z.string().min(1).max(100),
        verifiedAt: z.string().datetime(),
      })
      .strict(),
    root: field,
  })
  .strict();
export function parseVisualSchema(input: unknown): VisualSchema {
  // Bound untrusted JSON before recursive validation.
  const stack = [{ value: input, depth: 0 }];
  let count = 0;
  while (stack.length) {
    const { value, depth } = stack.pop()!;
    if (++count > 5000 || depth > 30)
      throw new Error('Schema is too large or deeply nested.');
    if (value && typeof value === 'object')
      for (const v of Object.values(value))
        stack.push({ value: v, depth: depth + 1 });
  }
  if (new TextEncoder().encode(JSON.stringify(input)).length > 65536)
    throw new Error('Schema exceeds 64 KiB.');
  const result = definition.parse(input);
  if (result.root.type !== 'object')
    throw new Error('Schema root must be an object.');
  const fields = [{ node: result.root, depth: 0 }];
  let total = 0;
  while (fields.length) {
    const { node, depth } = fields.pop()!;
    if (++total > 300 || depth > 8)
      throw new Error('Schema exceeds 300 fields or eight nested levels.');
    for (const child of node.fields ?? [])
      fields.push({ node: child, depth: depth + 1 });
    if (node.items) fields.push({ node: node.items, depth: depth + 1 });
  }
  return result;
}
