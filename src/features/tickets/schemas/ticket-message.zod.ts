import { createInsertSchema } from 'drizzle-zod';

import { ticketMessage } from '@/lib/db/schema';
import getParseStringToIntegerSchema from '@/lib/zod/parse-string-to-integer.zod';

export const insertTicketMessageZod = createInsertSchema(ticketMessage, {
  message: (schema) =>
    schema
      .min(1, 'Please type something')
      .max(
        2000,
        'Your message cannot exceed 2000 characters. Please focus on the most relevant details.',
      ),
  ticketId: getParseStringToIntegerSchema(),
}).omit({ createdAt: true, userId: true });
