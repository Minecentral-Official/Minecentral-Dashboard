import { z } from 'zod';

import { ticketCategoryConfig } from '@/features/tickets/config/ticket-category.config';

export const ticketZod = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  category: z.enum(ticketCategoryConfig),
  message: z.string().min(10, 'Description must be at least 10 characters'),
});
