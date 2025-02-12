import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

import { ticketCategoryConfig } from '@/features/tickets/config/ticket-category.config';
import { ticket } from '@/lib/db/schema';

export const ticketCreateZod = createInsertSchema(ticket, {
  title: (schema) =>
    schema
      .min(5, 'Title must be at least 5 characters')
      .max(50, 'Title is too long'),
  category: z.enum(ticketCategoryConfig),
}).omit({ createdAt: true, status: true, userId: true });
