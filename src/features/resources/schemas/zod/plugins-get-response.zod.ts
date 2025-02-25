import { z } from 'zod';

import { TGetPluginsResponse } from '@/features/resources/queries/resources-filter.get';
import { TResourcePluginBasic } from '@/features/resources/types/plugin-basic.type';

export const pluginsGetResponseZod = z.object({
  resources: z.array(z.custom<TResourcePluginBasic>()),
  totalCount: z.number(),
  currentPage: z.number(),
  totalPages: z.number(),
}) satisfies z.ZodType<TGetPluginsResponse>;
