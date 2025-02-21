import { z } from 'zod';

import { TGetPluginsResponse } from '@/features/resource-plugin/queries/plugins-find.filter';
import { TResourcePluginBasic } from '@/features/resource-plugin/types/plugin-basic.type';

export const pluginsGetResponseZod = z.object({
  resources: z.array(z.custom<TResourcePluginBasic>()),
  totalCount: z.number(),
  currentPage: z.number(),
  totalPages: z.number(),
}) satisfies z.ZodType<TGetPluginsResponse>;
