import { z } from 'zod';

import { C_ResourceType } from '@/features/resources/config/resource-type.config';
import { T_ResourceSimpleRequest } from '@/features/resources/types/t-resource-api-requests.type';

//Fetch request schema for the client

export const resourcesListAllApiRequestZod = z.object({
  limit: z.number(),
  page: z.number(),
  type: z.enum(C_ResourceType).optional(),
}) satisfies z.ZodType<T_ResourceSimpleRequest>;
