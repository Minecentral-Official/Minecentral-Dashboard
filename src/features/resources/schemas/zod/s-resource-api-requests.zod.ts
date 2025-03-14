import { z } from 'zod';

import { C_PluginCategories } from '@/features/resources/config/c-plugin-categories.config';
import { C_PluginLoaders } from '@/features/resources/config/c-plugin-loaders.plugin';
import { C_GameVersions } from '@/lib/configs/c-game-versions.config';
import { C_ResourceType } from '@/lib/configs/c-resource-type.config';

export const S_ResourceFilterRequestSchema = z.object({
  query: z.string().optional(),
  page: z.number(),
  limit: z.number(),
  categories: z.array(z.enum(C_PluginCategories)).optional(),
  versions: z.array(z.enum(C_GameVersions)).optional(),
  loaders: z.array(z.enum(C_PluginLoaders)).optional(),
  type: z.enum(C_ResourceType),
});

export const S_ResourceSimpleRequestSchema = z.object({
  page: z.number(),
  limit: z.number(),
  type: z.enum(C_ResourceType).optional(),
});
