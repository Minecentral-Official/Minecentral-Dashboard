import { z } from 'zod';

import { C_CategoriesPlugin } from '@/features/resources/config/plugin-categories.config';
import { C_ResourceType } from '@/features/resources/config/resource-type.config';
import { T_ResourceFilterRequest } from '@/features/resources/types/t-resource-api-requests.type';

//Fetch request schema for the client

export const resourcesListFilterApiRequestZod = z.object({
  query: z.optional(z.string()),
  limit: z.number(),
  page: z.number(),
  categories: z.optional(z.enum(C_CategoriesPlugin).array()),
  type: z.enum(C_ResourceType),
}) satisfies z.ZodType<T_ResourceFilterRequest>;
