import { z } from 'zod';

export const resourceUpdateGeneralZod = z.object({
  resourceId: z.string(),
  newTitle: z.string().optional(),
  newSlug: z.string().optional(),
  newSubtitle: z.string().optional(),
  newIconFile: z.instanceof(File).optional(),
});
