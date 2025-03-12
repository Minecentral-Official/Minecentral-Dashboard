import { relations } from 'drizzle-orm';
import { integer, json, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import { C_GameVersions } from '@/features/resources/config/c-game-versions.config';
import { resourceTable } from '@/lib/db/schema';

export const resourceReleaseTable = pgTable('resourceTableRelease', {
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
  metadata: json().notNull(), // Flexible JSON field for different metadata
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
