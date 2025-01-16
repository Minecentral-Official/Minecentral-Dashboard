import { z } from 'zod';

export const ticketZod = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  category: z.string().min(1, 'Please select a category'),
  message: z.string().min(10, 'Description must be at least 10 characters'),
});
