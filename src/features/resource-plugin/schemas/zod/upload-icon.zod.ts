import { z } from 'zod';

export const pluginUploadToProjectZod = z.object({
  resourceId: z.number(),
});
