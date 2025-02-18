import { z } from 'zod';

import { TPluginCategories } from '@/features/resource-plugin/config/categories.plugin';
import { TPluginVersions } from '@/features/resource-plugin/config/versions.plugin';
import DTOResourcePlugin from '@/features/resource-plugin/dto/plugin.dto';

type PluginType = ReturnType<typeof DTOResourcePlugin>;

export const PluginsFilteredSchema = z.object({
  id: z.number(),
  title: z.string(),
  subtitle: z.string(),
  categories: z.enum(TPluginCategories).array(),
  description: z.string(),
  discord: z.string().url(),
  downloads: z.number(),
  language: z.string(),
  linkSource: z.string(),
  linkSupport: z.string(),
  releaseId: z.number(),
  updatedAt: z.date(),
  createdAt: z.date(),
  versionSupport: z.enum(TPluginVersions).array(),
  author: z.object({
    image: z.string(),
    name: z.string(),
    id: z.string(),
  }),
}) satisfies z.ZodType<PluginType>;

// z.object({
//   resources: z.object(typeof DTOResourcePlugin)
//   // query: z.string(),
//   // page: z.number(),
//   // limit: z.number(),
//   // categories: z.enum(TPluginCategories).array(),
//   // versions: z.enum(TPluginVersions).array(),
// });
