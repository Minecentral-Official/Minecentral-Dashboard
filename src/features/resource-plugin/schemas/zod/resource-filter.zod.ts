import { z } from 'zod';

import { TResourceSort } from '@/features/resource-plugin/config/sort-by.config';

export const ResourceFilterSchema = z.object({
  limit: z
    .preprocess((a) => parseInt(a as string, 10), z.number().positive().max(64))
    .catch(16),
  page: z
    .preprocess((a) => parseInt(a as string, 10), z.number().positive())
    .catch(0),
  sortBy: z.enum(TResourceSort).default('relevance').catch('relevance'),
  searchQuery: z.string().catch(''),
});
