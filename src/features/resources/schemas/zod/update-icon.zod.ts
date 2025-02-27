import { z } from 'zod';

export const resourceUpdateIconZod = z.object({
  resourceId: z.string(),
});
