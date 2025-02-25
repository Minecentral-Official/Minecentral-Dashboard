import { relations } from 'drizzle-orm';
import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import { userTable } from '@/lib/auth/schema/auth.table';
import { ticket } from '@/lib/db/schema';

export const ticketMessage = pgTable('ticketMessage', {
  id: integer().primaryKey().generatedAlwaysAsIdentity({ startWith: 1000 }),
  ticketId: integer()
    .notNull()
    .references(() => ticket.id),
  userId: text()
    .notNull()
    .references(() => userTable.id),
  message: text().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const ticketMessageRelations = relations(ticketMessage, ({ one }) => ({
  user: one(userTable, {
    fields: [ticketMessage.userId],
    references: [userTable.id],
  }),
  ticket: one(ticket, {
    fields: [ticketMessage.ticketId],
    references: [ticket.id],
  }),
}));
