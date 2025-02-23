import { relations } from 'drizzle-orm';
import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import { TPluginCategories } from '@/features/resource-plugin/config/categories.plugin';
import { TPluginVersions } from '@/features/resource-plugin/config/versions.plugin';
import { pluginReleaseTable } from '@/features/resource-plugin/schemas/plugin-release.table';
import { user } from '@/lib/db/schema';

export const pluginTable = pgTable('resourcePlugin', {
  id: integer().primaryKey().generatedAlwaysAsIdentity({ startWith: 1000 }),
  userId: text()
    .notNull()
    .references(() => user.id),
  title: text().notNull(),
  subtitle: text().notNull(),
  description: text().notNull(),
  versionSupport: text('versionSupport', { enum: TPluginVersions })
    .array()
    .notNull(),
  categories: text('categories', { enum: TPluginCategories }).array().notNull(),
  //Options
  iconUrl: text(),
  // banner?: Types.ObjectId,
  discord: text(),
  languages: text().array(),
  tags: text().array(),
  linkSource: text(),
  linkSupport: text(),
  //Other
  downloads: integer().notNull().default(0),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const resourceRelations = relations(pluginTable, ({ one, many }) => ({
  user: one(user, {
    fields: [pluginTable.userId],
    references: [user.id],
  }),
  releases: many(pluginReleaseTable),
}));
