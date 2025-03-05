import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import { C_CategoriesPlugin } from '@/features/resources/config/plugin-categories.config';
import { C_ResourceType } from '@/features/resources/config/resource-type.config';
import { resourceReleaseTable } from '@/features/resources/schemas/resource-release.table';
import { likedResourceTable, userTable } from '@/lib/db/schema';

export const resourceTable = pgTable('resourceTable', {
  id: text().primaryKey(),
  userId: text()
    .notNull()
    .references(() => userTable.id),
  //Required to start Project
  title: text().notNull(),
  subtitle: text().notNull(),
  slug: text().notNull(),
  type: text('type', {
    enum: C_ResourceType,
  }).notNull(),
  //Required to publish
  description: text(),
  categories: text('categories', { enum: C_CategoriesPlugin }).array(),
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
