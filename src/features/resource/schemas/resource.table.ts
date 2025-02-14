import { relations } from 'drizzle-orm';
import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import { resourceRelease } from '@/features/resource/schemas/resource-release.table';
import { TMinecraftVersion } from '@/features/resource/types/minecraft-versions.type';
import { user } from '@/lib/db/schema';

export const resourceTable = pgTable('resource', {
  id: integer().primaryKey().generatedAlwaysAsIdentity({ startWith: 1000 }),
  userId: text()
    .notNull()
    .references(() => user.id),
  releaseId: integer().references(() => resourceRelease.id),
  title: text().notNull(),
  subtitle: text().notNull(),
  categories: integer().array(),
  description: text().notNull(),

  versionSupport: text('versionSupport', { enum: TMinecraftVersion })
    .array()
    .notNull(),
  //Options
  // image?: Types.ObjectId,
  // banner?: Types.ObjectId,
  discord: text(),
  language: text(),
  tags: text().array(),
  // versionSupport: number[],
  linkSource: text(),
  linkSupport: text(),
  //Other
  downloads: integer(),
  // reports?: number,
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const resourceRelations = relations(resourceTable, ({ one }) => ({
  user: one(user, {
    fields: [resourceTable.userId],
    references: [user.id],
  }),
  // subscriptions: many(hostSubscription),
}));
