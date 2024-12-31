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
  'nodes',
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

// actual schema
export const metadataHostSchema = z.object(schemaConfig);

export type MetadataHostType = z.infer<typeof metadataHostSchema>;
