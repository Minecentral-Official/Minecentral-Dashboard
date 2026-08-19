import { relations } from 'drizzle-orm';
import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import { serverTable } from '@/features/serverlist/schemas/server.table';
import { userTable } from '@/lib/db/schema';
import createUUID from '@/lib/utils/create-uuid';

export const C_ServerVoteDeliveryStatus = [
  'not_configured',
  'sent',
  'failed',
] as const;

export const serverVotesTable = pgTable(
  'serverVote',
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => createUUID()),
    serverId: text()
      .notNull()
      .references(() => serverTable.id, { onDelete: 'cascade' }),
    anonymousVoterId: text().notNull(),
    ipHash: text(),
    userAgentHash: text(),
    userId: text().references(() => userTable.id, { onDelete: 'set null' }),
    minecraftUsername: text(),
    votifierEnabledAtVote: boolean().notNull().default(false),
    votifierDeliveryStatus: text('votifierDeliveryStatus', {
      enum: C_ServerVoteDeliveryStatus,
    })
      .notNull()
      .default('not_configured'),
    votifierDeliveryError: text(),
    voteTime: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
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
