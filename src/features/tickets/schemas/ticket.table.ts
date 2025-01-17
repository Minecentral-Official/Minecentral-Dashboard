import { relations } from 'drizzle-orm';
import { date, integer, pgTable, text } from 'drizzle-orm/pg-core';

import { ticketStatusConfig } from '@/features/tickets/config/ticket-status.config';
import { user } from '@/lib/auth/schema/auth.table';
import { ticketMessage } from '@/lib/db/schema';

export const ticket = pgTable('ticket', {
  id: integer().primaryKey().generatedAlwaysAsIdentity({ startWith: 1000 }),
  userId: text()
    .notNull()
    .references(() => user.id),
  title: text().notNull(),
  category: text().notNull(),
  // description: text().notNull(),
  status: text('status', { enum: ticketStatusConfig })
    .notNull()
    .default('open'),
  createdAt: date().defaultNow().notNull(),
});

export const ticketRelations = relations(ticket, ({ one, many }) => ({
  user: one(user, {
    fields: [ticket.userId],
    references: [user.id],
  }),
  messages: many(ticketMessage),
}));
