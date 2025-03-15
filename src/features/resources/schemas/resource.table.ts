import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import { C_PluginCategories } from '@/features/resources/config/c-plugin-categories.config';
import { resourceReleaseTable } from '@/features/resources/schemas/resource-release.table';
import { C_ResourceType } from '@/lib/configs/c-resource-type.config';
import { likedResourceTable, userTable } from '@/lib/db/schema';

export const resourceTable = pgTable('resourceTable', {
  id: text().primaryKey(),
  userId: text()
    .notNull()
    .references(() => userTable.id),
  //Required to start Project
  title: text().notNull(),
  subtitle: text().notNull(),
  slug: text().notNull().unique(),
  type: text('type', {
    enum: C_ResourceType,
  }).notNull(),
  //Required to publish
  description: text(),
  categories: text('categories', { enum: C_PluginCategories }).array(),
  iconUrl: text(),
  languages: text().array(),
  status: text('status', {
    enum: ['draft', 'pending', 'rejected', 'accepted'],
  })
    .default('draft')
    .notNull(),

  //Optional
  linkIssues: text(),
  linkSource: text(),
  linkSupport: text(),
  linkDiscord: text(),
  linkDonation: text(),
  //Stats
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const resourceRelations = relations(resourceTable, ({ one, many }) => ({
  user: one(userTable, {
    fields: [resourceTable.userId],
    references: [userTable.id],
  }),
  releases: many(resourceReleaseTable),
  likes: many(likedResourceTable),
}));
