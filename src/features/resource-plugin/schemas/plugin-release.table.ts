import { relations } from 'drizzle-orm';
import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import { pluginTable } from '@/lib/db/schema';

export const pluginReleaseTable = pgTable('pluginRelease', {
  id: integer().primaryKey().generatedAlwaysAsIdentity({ startWith: 1000 }),
  pluginId: integer()
    .references(() => pluginTable.id)
    .notNull(),
  title: text().notNull(),
  description: text().notNull(),
  fileUrl: text().notNull(),
  downloadId: text().unique().notNull(),
  version: text().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const pluginReleaseRelations = relations(
  pluginReleaseTable,
  ({ one }) => ({
    plugin: one(pluginTable, {
      fields: [pluginReleaseTable.pluginId],
      references: [pluginTable.id],
    }),
  }),
);
