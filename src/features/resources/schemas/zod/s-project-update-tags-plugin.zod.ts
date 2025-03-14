import { z } from 'zod';

import { C_PluginCategories } from '@/features/resources/config/c-plugin-categories.config';

export const S_ProjectUpdateTags_Plugin = z.object({
  id: z.string(),
  categories: z.array(z.enum(C_PluginCategories)),
});
