import { z } from 'zod';

export const projectUpdateDescriptionZod = z.object({
  id: z.string(),
  description: z
    .string()
    .min(32, 'Please make an effort to describe your resource!'),
});
