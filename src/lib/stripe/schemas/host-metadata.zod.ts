import 'server-only';

import { z } from 'zod';

import getParseStringToIntegerSchema from '@/lib/zod/parse-string-to-integer.zod';

// now we can add additional fields to this validation schema easily :^)
const metadataHostKeys = [
  'allocations',
  'backups',
  'cpu',
  'databases',
  'disk',
  'egg',
  'io',
  'ram',
  'splits',
  'swap',
] as const;

// creating zod schema config
const schemaConfig = metadataHostKeys.reduce(
  (prev, curr) => ({ ...prev, [curr]: getParseStringToIntegerSchema() }),
  {} as Record<
    (typeof metadataHostKeys)[number],
    ReturnType<typeof getParseStringToIntegerSchema>
  >,
);

const nodesSchema = z.string().transform((value, ctx) => {
  const parsedNodeArray = value.split(',').map((node, index) => {
    const nodeValue = node.trim();
    const parsedNodeValue = parseInt(nodeValue);

    if (!isNaN(parsedNodeValue)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Node at index ${index} cannot be parsed to integer`,
      });
    }
    return z.NEVER;
  });

  return parsedNodeArray;
});

// actual schema
export const metadataHostSchema = z
  .object({
    ...schemaConfig,
    nodes: nodesSchema,
    isDefaultPlan: z.boolean().catch(false),
  })
  .nullable()
  .catch(null);

export type MetadataHostType = z.infer<typeof metadataHostSchema>;
