import { relations } from 'drizzle-orm';
import { integer, pgTable, text } from 'drizzle-orm/pg-core';

import { resourceRelease } from '@/features/resource/schemas/resource-release.table';
import { TMinecraftVersion } from '@/features/resource/types/minecraft-versions.type';
import { user } from '@/lib/db/schema';

export const resource = pgTable('resource', {
  id: integer().primaryKey().generatedAlwaysAsIdentity({ startWith: 1000 }),
  userId: text()
    .notNull()
    .references(() => user.id),
  releaseId: integer()
    .references(() => resourceRelease.id)
    .notNull(),
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
  tags: text(),
  // versionSupport: number[],
  linkSource: text(),
  linkSupport: text(),
  //Other
  downloads: integer(),
  // reports?: number,
  // updatedAt: Date,
  // createdAt: Date,
});

export const resourceRelations = relations(resource, ({ one }) => ({
  user: one(user, {
    fields: [resource.userId],
    references: [user.id],
  }),
  // subscriptions: many(hostSubscription),
}));

type ResourceBase = typeof resource.$inferSelect;

export type Resource = ResourceBase & {
  user: typeof user.$inferSelect;
  // subscriptions: (typeof hostSubscription.$inferSelect)[];
};
