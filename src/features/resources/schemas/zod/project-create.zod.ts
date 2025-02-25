import { z } from 'zod';

export const projectCreateZod = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(50, 'Title is too long'),
  subtitle: z
    .string()
    .max(120, `Please provide a brief summary (120 max characters)`)
    .min(3, 'Mininum characters 3'),
  slug: z.string().min(3, 'Minium URL length is 3'),
});
