import { z } from 'zod';

import { TGetPluginsResponse } from '@/features/resources/queries/resources-filter.get';
import { T_DTOResource } from '@/features/resources/types/t-dto-resource.type';

export const pluginsGetResponseZod = z.object({
  resources: z.array(z.custom<T_DTOResource>()),
  totalCount: z.number(),
  currentPage: z.number(),
  totalPages: z.number(),
}) satisfies z.ZodType<TGetPluginsResponse>;
