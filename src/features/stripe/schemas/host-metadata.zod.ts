import 'server-only';

import { z } from 'zod';

import getParseStringToIntegerSchema from '@/lib/zod/parse-string-to-integer.zod';

// now we can add additional fields to this validation schema easily :^)
const hostMetadataKeys = [
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
const schemaConfig = hostMetadataKeys.reduce(
  (prev, curr) => ({ ...prev, [curr]: getParseStringToIntegerSchema() }),
  {} as Record<
    (typeof hostMetadataKeys)[number],
    ReturnType<typeof getParseStringToIntegerSchema>
  >,
);

// actual schema
export const hostMetadataSchema = z.object(schemaConfig);

export type HostMetadataType = z.infer<typeof hostMetadataSchema>;
