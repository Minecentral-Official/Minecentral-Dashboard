import { z } from 'zod';

import { TGetPluginsResponse } from '@/features/resource-plugin/queries/resources-find.filter';
import { TResourcePlugin } from '@/features/resource-plugin/types/plugin.type';

export const PluginsGetResponseSchema = z.object({
  resources: z.array(z.custom<TResourcePlugin>()),
  totalCount: z.number(),
  currentPage: z.number(),
  totalPages: z.number(),
}) satisfies z.ZodType<TGetPluginsResponse>;
