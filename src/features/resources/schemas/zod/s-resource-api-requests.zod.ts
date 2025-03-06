import { z } from 'zod';

import { C_CategoriesPlugin } from '@/features/resources/config/plugin-categories.config';
import { C_ResourceVersionSupport } from '@/features/resources/config/resource-version-support.config';
import { C_ResourceType } from '@/lib/configs/c-resource-type.config';

export const S_ResourceFilterRequestSchema = z.object({
  query: z.string().optional(),
  page: z.number(),
  limit: z.number(),
  categories: z.array(z.enum(C_CategoriesPlugin)).optional(),
  versions: z.array(z.enum(C_ResourceVersionSupport)).optional(),
  type: z.enum(C_ResourceType),
});

export const S_ResourceSimpleRequestSchema = z.object({
  page: z.number(),
  limit: z.number(),
  type: z.enum(C_ResourceType).optional(),
});
