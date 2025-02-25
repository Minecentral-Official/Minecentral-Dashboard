import { relations } from 'drizzle-orm';
import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import { userTable } from '@/lib/db/schema';

export const recentActivityTable = pgTable('recentActivity', {
  id: integer().primaryKey().generatedAlwaysAsIdentity({ startWith: 1 }),
  userId: text()
    .notNull()
    .references(() => userTable.id),
  action: text().notNull(),
  timestamp: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const recentActivityRelations = relations(
  recentActivityTable,
  ({ one }) => ({
    user: one(userTable, {
      fields: [recentActivityTable.userId],
      references: [userTable.id],
    }),
  }),
);

type RecentActivityBase = typeof recentActivityTable.$inferSelect;

export type RecentActivity = RecentActivityBase & {
  user: typeof userTable.$inferSelect;
};
