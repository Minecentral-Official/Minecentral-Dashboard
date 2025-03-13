import { relations } from 'drizzle-orm';
import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import { C_GameVersions } from '@/features/resources/config/c-game-versions.config';
import { C_PluginLoaders } from '@/features/resources/config/c-loaders.plugin';
import { resourceTable } from '@/lib/db/schema';

export const resourceReleaseTable = pgTable('resourceTableReleases', {
  id: text().unique().primaryKey().notNull(),
  // id: integer().primaryKey().generatedAlwaysAsIdentity({ startWith: 1000 }),
  pluginId: text()
    .references(() => resourceTable.id)
    .notNull(),
  title: text().notNull(),
  description: text(),
  compatibleVersions: text('compatibleVersions', {
    enum: C_GameVersions,
  })
    .array()
    .notNull(),
  loaders: text('loaders', {
    enum: C_PluginLoaders,
  }).array(),
  fileUrl: text().notNull(),
  version: text().notNull(),
  //Stats
  downloads: integer().default(0),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const resourceReleaseRelations = relations(
  resourceReleaseTable,
  ({ one }) => ({
    plugin: one(resourceTable, {
      fields: [resourceReleaseTable.pluginId],
      references: [resourceTable.id],
    }),
  }),
);
