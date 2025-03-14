import { z } from 'zod';

import { C_ResourceSort } from '@/features/resources/config/c-resource-sort-by.config';

export const S_ResourceListFilter = z.object({
  limit: z
    .preprocess((a) => parseInt(a as string, 10), z.number().positive().max(64))
    .catch(16),
  page: z
    .preprocess((a) => parseInt(a as string, 10), z.number().positive())
    .catch(1),
  sortBy: z.enum(C_ResourceSort).default('relevance').catch('relevance'),
  searchQuery: z.string().catch(''),
});
