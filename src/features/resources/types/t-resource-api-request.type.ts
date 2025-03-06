import { z } from 'zod';

import {
  S_ResourceFilterRequestSchema,
  S_ResourceSimpleRequestSchema,
} from '@/features/resources/schemas/zod/s-resource-api-requests.zod';

export type T_ResourceFilterRequest = z.infer<
  typeof S_ResourceFilterRequestSchema
>;

export type T_ResourceSimpleRequest = z.infer<
  typeof S_ResourceSimpleRequestSchema
>;
