import { z } from 'zod';

export const resourceUpdateDescriptionZod = z.object({
  resourceId: z.string(),
  description: z.string(),
});
