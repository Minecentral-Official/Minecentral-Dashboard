import { z } from 'zod';

import { C_PluginLoaders } from '@/features/resources/config/c-plugin-loaders.plugin';
import { C_GameVersions } from '@/lib/configs/c-game-versions.config';

export const S_ProjectCreateVersion_Plugin = z.object({
  id: z.string(),
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(50, 'Max characters 50'),
  description: z.string().optional(),
  version: z.string().max(16, 'Max characters 16'),
  compatibleVersions: z
    .array(z.enum(C_GameVersions))
    .min(1, 'Please select atleast 1 supported version'),
  loaders: z.array(z.enum(C_PluginLoaders)),
});
