import { z } from 'zod';

export const resourceUpdateGeneralZod = z.object({
  resourceId: z.string(),
  title: z.string().optional(),
  slug: z.string().optional(),
  subtitle: z.string().optional(),
});
