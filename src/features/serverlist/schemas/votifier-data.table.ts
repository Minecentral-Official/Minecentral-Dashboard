import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, text } from 'drizzle-orm/pg-core';

import { serverTable } from '@/lib/db/schema';

export const serverVotifierTable = pgTable('serverVotifierTable', {
  serverId: text()
    .notNull()
    .primaryKey()
    .references(() => serverTable.id, { onDelete: 'cascade' }),
  //Required to start Project
  ip: text().notNull(),
  port: integer(),
  publicKey: text(),
  enabled: boolean(),
});

export const serverVotifierRelations = relations(
  serverVotifierTable,
  ({ one }) => ({
    server: one(serverTable, {
      fields: [serverVotifierTable.serverId],
      references: [serverTable.id],
    }),
  }),
);
