import { relations } from 'drizzle-orm';
import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import { TPluginVersions } from '@/features/resources/config/versions.plugin';
import { resourceTable } from '@/lib/db/schema';

export const resourceReleaseTable = pgTable('resourceRelease', {
  id: integer().primaryKey().generatedAlwaysAsIdentity({ startWith: 1000 }),
  pluginId: text()
    .references(() => resourceTable.id)
    .notNull(),
  title: text().notNull(),
  description: text().notNull(),
  compatibleVersions: text('versionSupport', { enum: TPluginVersions })
    .array()
    .notNull(),
  // compatiblePlatforms: text('versionSupport', { enum: TPluginVersions })
  //   .array()
  //   .notNull(),
  fileUrl: text().notNull(),
  downloadId: text().unique().notNull(),
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
