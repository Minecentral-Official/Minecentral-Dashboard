import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

import { C_ServerCategories } from '@/features/serverlist/config/c-server-categories.config';
import { C_ServerLoaders } from '@/features/serverlist/config/c-server-loaders.config';
import { serverVotesTable } from '@/features/serverlist/schemas/votes.table';
import { serverVotifierTable } from '@/features/serverlist/schemas/votifier-data.table';
import { userTable } from '@/lib/db/schema';
import lower from '@/lib/db/utils/lower';

export const C_ServerStatus = ['draft', 'published'] as const;

export const serverTable = pgTable(
  'serverTable',
  {
    id: text().primaryKey(),
    userId: text()
      .notNull()
      .references(() => userTable.id),
    // Required to create
    title: text().notNull(),
    ip: text().notNull(),
    port: integer().notNull(),
    slug: text().notNull(),
    // Publication
    status: text('status', { enum: C_ServerStatus }).notNull().default('draft'),
    // Required to publish
    description: text(),
    categories: text('categories', { enum: C_ServerCategories }).array(),
    platforms: text('platforms', { enum: C_ServerLoaders }).array(),
    iconUrl: text(),
    languages: text().array(),
    // Optional
    linkDiscord: text(),
    voteCooldownHours: integer().notNull().default(24),
    // Stats
    updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    slugUnique: uniqueIndex('server_slug_unique').on(lower(table.slug)),
    addressUnique: uniqueIndex('server_address_unique').on(
      lower(table.ip),
      table.port,
    ),
  }),
);

export const serverRelations = relations(serverTable, ({ one, many }) => ({
  user: one(userTable, {
    fields: [serverTable.userId],
    references: [userTable.id],
  }),
  votes: many(serverVotesTable),
  votifier: one(serverVotifierTable, {
    fields: [serverTable.id],
    references: [serverVotifierTable.serverId],
  }),
}));
