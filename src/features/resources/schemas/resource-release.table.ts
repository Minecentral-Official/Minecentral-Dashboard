import { relations } from 'drizzle-orm';
import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import { C_ResourceVersionSupport } from '@/features/resources/config/resource-version-support.config';
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
    enum: C_ResourceVersionSupport,
  })
    .array()
    .notNull(),
  // compatiblePlatforms: text('versionSupport', { enum: TPluginVersions })
  //   .array()
  //   .notNull(),
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
