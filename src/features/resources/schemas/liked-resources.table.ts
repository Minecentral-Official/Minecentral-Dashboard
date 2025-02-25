import { relations } from 'drizzle-orm';
import { pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core';

import { resourceTable, userTable } from '@/lib/db/schema';

export const likedResourceTable = pgTable(
  'liked_resources',
  {
    userId: text('user_id')
      .notNull()
      .references(() => userTable.id, { onDelete: 'cascade' }),
    resourceId: text('resource_id')
      .notNull()
      .references(() => resourceTable.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.resourceId] }),
  }),
);

export const likedResourcesRelations = relations(
  likedResourceTable,
  ({ one }) => ({
    plugin: one(resourceTable, {
      fields: [likedResourceTable.resourceId],
      references: [resourceTable.id],
    }),
    user: one(userTable, {
      fields: [likedResourceTable.userId],
      references: [userTable.id],
    }),
  }),
);
