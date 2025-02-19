import { z } from 'zod';

import { TPluginCategories } from '@/features/resource-plugin/config/categories.plugin';
import { TGetPluginsRequest } from '@/features/resource-plugin/queries/plugins-find.filter';

export const PluginsGetRequestSchema = z.object({
  query: z.optional(z.string()),
  limit: z.number(),
  page: z.number(),
  categories: z.optional(z.enum(TPluginCategories).array()),
}) satisfies z.ZodType<TGetPluginsRequest>;
