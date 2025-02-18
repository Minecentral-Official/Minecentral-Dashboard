import { z } from 'zod';

import { TPluginCategories } from '@/features/resource-plugin/config/categories.plugin';
import DTOResourcePlugin from '@/features/resource-plugin/dto/plugin.dto';

type PluginType = ReturnType<typeof DTOResourcePlugin>;

export const PluginsFilteredSchema: z.ZodType<PluginType> = z.object({
  id: z.number(),
  title: z.string(),
  subtitle: z.string(),
  categories: z.array(z.enum(TPluginCategories)),
  description: z.string(),
  discord: z.string().url(),
  downloads: z.number(),
  language: z.string(),
  linkSource: z.string(),
  linkSupport: z.string(),
  releaseId: z.string(),
  updatedAt: z.date(),
  createdAt: z.date(),
  versionSupport: z.string(),
  author: {
    image: z.string(),
    name: z.string(),
    id: z.number(),
  },
});

// z.object({
//   resources: z.object(typeof DTOResourcePlugin)
//   // query: z.string(),
//   // page: z.number(),
//   // limit: z.number(),
//   // categories: z.enum(TPluginCategories).array(),
//   // versions: z.enum(TPluginVersions).array(),
// });
