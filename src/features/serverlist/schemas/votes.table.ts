import { relations } from 'drizzle-orm';
import { pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core';

import { resourceTable, userTable } from '@/lib/db/schema';
import { serverTable } from './server.table';

export const serverVotesTable = pgTable('serverVotes', {
    userId: text('user_id')
      .notNull()
      .references(() => userTable.id, { onDelete: 'cascade' }),
    serverId: text('server_id')
      .notNull()
      .references(() => resourceTable.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.serverId] }),
  }),
);

export const votesServerRelations = relations(
  serverVotesTable,
  ({ one }) => ({
    server: one(serverTable, {
      fields: [serverVotesTable.serverId],
      references: [serverTable.id],
    }),
    user: one(userTable, {
      fields: [serverVotesTable.userId],
      references: [userTable.id],
    }),
  }),
);
