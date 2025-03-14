import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import { C_PluginCategories } from '@/features/resources/config/c-plugin-categories.config';
import { userTable } from '@/lib/db/schema';
import { serverVotesTable } from './votes.table';

export const serverTable = pgTable('serverTable', {
  id: text().primaryKey(),
  userId: text()
    .notNull()
    .references(() => userTable.id),
  //Required to start Project
  title: text().notNull(),
  subtitle: text().notNull(),
  slug: text().notNull(),
  //Required to publish
  description: text(),
  categories: text('categories', { enum: C_PluginCategories }).array(),
  iconUrl: text(),
  languages: text().array(),
  //Optional
  linkDiscord: text(),
  //Stats
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const serverRelations = relations(serverTable, ({ one, many }) => ({
  user: one(userTable, {
    fields: [serverTable.userId],
    references: [userTable.id],
  }),
  votes: many(serverVotesTable),
}));
