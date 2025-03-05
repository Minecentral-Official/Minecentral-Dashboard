import { z } from 'zod';

import { T_DTOResource } from '@/features/resources/types/t-dto-resource.type';
import { T_ResourcesResponse } from '@/features/resources/types/t-resource-api-responses.type';

export const resourcesListFilterApiResponseZod = z.object({
  resources: z.array(z.custom<T_DTOResource>()),
  totalPages: z.number(),
}) satisfies z.ZodType<T_ResourcesResponse>;
