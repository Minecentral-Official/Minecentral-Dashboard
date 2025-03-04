import { z } from 'zod';

import { CategoriesPlugin } from '@/features/resources/config/categories.plugin';
import {
  TGetPluginsRequest,
  TGetPluginsResponse,
} from '@/features/resources/queries/resource-list-all-filter.get';
import { T_DTOResource } from '@/features/resources/types/t-dto-resource.type';

//Fetch request schema for the client

export const resourcesListFilterApiRequestZod = z.object({
  query: z.optional(z.string()),
  limit: z.number(),
  page: z.number(),
  categories: z.optional(z.enum(CategoriesPlugin).array()),
}) satisfies z.ZodType<TGetPluginsRequest>;

export const resourcesListFilterApiResponseZod = z.object({
  resources: z.array(z.custom<T_DTOResource>()),
  totalCount: z.number(),
  currentPage: z.number(),
  totalPages: z.number(),
}) satisfies z.ZodType<TGetPluginsResponse>;
