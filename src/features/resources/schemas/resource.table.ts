import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import { TPluginCategories } from '@/features/resources/config/categories.plugin';
import { resourceReleaseTable } from '@/features/resources/schemas/resource-release.table';
import { likedResourceTable, user } from '@/lib/db/schema';

export const resourceTable = pgTable('resourceTable', {
  id: text().primaryKey(),
  userId: text()
    .notNull()
    .references(() => user.id),
  //Required to start Project
  title: text().notNull(),
  subtitle: text().notNull(),
  slug: text().notNull(),
  //Required to publish
  description: text(),
  categories: text('categories', { enum: TPluginCategories }).array(),
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
  user: one(user, {
    fields: [resourceTable.userId],
    references: [user.id],
  }),
  releases: many(resourceReleaseTable),
  likes: many(likedResourceTable),
}));
