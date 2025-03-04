import { z } from 'zod';

export const resourceListAllZod = z.object({
  limit: z
    .preprocess((a) => parseInt(a as string, 10), z.number().positive().max(64))
    .catch(16),
  page: z
    .preprocess((a) => parseInt(a as string, 10), z.number().positive())
    .catch(0),
});
