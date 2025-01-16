import { relations } from 'drizzle-orm';
import { date, integer, pgTable, text } from 'drizzle-orm/pg-core';

import { user } from '@/lib/auth/schema/auth.table';
import { TicketMessage, ticketMessage } from '@/lib/db/schema';

export const TTicketStatuses = ['open', 'in progress', 'closed'] as const;

export const ticket = pgTable('ticket', {
  id: integer().primaryKey().generatedAlwaysAsIdentity({ startWith: 1000 }),
  userId: text()
    .notNull()
    .references(() => user.id),
  title: text().notNull(),
  category: text().notNull(),
  // description: text().notNull(),
  status: text('status', { enum: TTicketStatuses }).notNull().default('open'),
  createdAt: date().defaultNow().notNull(),
});

export const ticketRelations = relations(ticket, ({ one, many }) => ({
  user: one(user, {
    fields: [ticket.userId],
    references: [user.id],
  }),
  messages: many(ticketMessage),
}));

type TicketBase = typeof ticket.$inferSelect;

export type Ticket = TicketBase & {
  user: typeof user.$inferSelect;
  messages: TicketMessage[];
};
