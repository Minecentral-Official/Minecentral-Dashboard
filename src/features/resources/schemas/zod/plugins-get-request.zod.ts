import { z } from 'zod';

import { TPluginCategories } from '@/features/resources/config/categories.plugin';
import { TGetPluginsRequest } from '@/features/resources/queries/resources-filter.get';

export const pluginsGetRequestZod = z.object({
  query: z.optional(z.string()),
  limit: z.number(),
  page: z.number(),
  categories: z.optional(z.enum(TPluginCategories).array()),
}) satisfies z.ZodType<TGetPluginsRequest>;
