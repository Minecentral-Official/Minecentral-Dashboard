import { z } from 'zod';

import { C_ResourceSort } from '@/features/resources/config/resource-sort-by.config';

export const resourceListFilterZod = z.object({
  limit: z
    .preprocess((a) => parseInt(a as string, 10), z.number().positive().max(64))
    .catch(16),
  page: z
    .preprocess((a) => parseInt(a as string, 10), z.number().positive())
    .catch(0),
  sortBy: z.enum(C_ResourceSort).default('relevance').catch('relevance'),
  searchQuery: z.string().catch(''),
});
