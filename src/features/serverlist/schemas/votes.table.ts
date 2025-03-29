import { relations } from 'drizzle-orm';
import { pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core';

import { serverTable } from '@/features/serverlist/schemas/server.table';
import { resourceTable, userTable } from '@/lib/db/schema';

export const serverVotesTable = pgTable(
  'serverVote',
  {
    userId: text()
      .notNull()
      .references(() => userTable.id, { onDelete: 'cascade' }),
    serverId: text()
      .notNull()
      .references(() => resourceTable.id, { onDelete: 'cascade' }),
    voteTime: timestamp().notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.serverId] }),
  }),
);

export const votesServerRelations = relations(serverVotesTable, ({ one }) => ({
  server: one(serverTable, {
    fields: [serverVotesTable.serverId],
    references: [serverTable.id],
  }),
  user: one(userTable, {
    fields: [serverVotesTable.userId],
    references: [userTable.id],
  }),
}));
