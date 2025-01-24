import { relations } from 'drizzle-orm';
import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import { user } from '@/lib/db/schema';

export const recentActivityTable = pgTable('recentActivity', {
  id: integer().primaryKey().generatedAlwaysAsIdentity({ startWith: 1 }),
  userId: text()
    .notNull()
    .references(() => user.id),
  action: text().notNull(),
  timestamp: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const recentActivityRelations = relations(
  recentActivityTable,
  ({ one }) => ({
    user: one(user, {
      fields: [recentActivityTable.userId],
      references: [user.id],
    }),
  }),
);

type RecentActivityBase = typeof recentActivityTable.$inferSelect;

export type RecentActivity = RecentActivityBase & {
  user: typeof user.$inferSelect;
};
