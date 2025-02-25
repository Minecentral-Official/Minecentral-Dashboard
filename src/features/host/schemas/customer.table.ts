import { relations } from 'drizzle-orm';
import { integer, pgTable, text } from 'drizzle-orm/pg-core';

import { hostSubscriptionTable, userTable } from '@/lib/db/schema';

export const hostCustomerTable = pgTable('hostCustomer', {
  id: integer().primaryKey().generatedAlwaysAsIdentity({ startWith: 1000 }),
  userId: text()
    .notNull()
    .references(() => userTable.id),
  //Stripe Customer ID
  stripeCustomerId: text().notNull(),
  //Pterodactyl User ID
  pterodactylUserId: integer().notNull(),
});

export const hostCustomerRelations = relations(
  hostCustomerTable,
  ({ one, many }) => ({
    user: one(userTable, {
      fields: [hostCustomerTable.userId],
      references: [userTable.id],
    }),
    subscriptions: many(hostSubscriptionTable),
  }),
);

type HostCustomerBase = typeof hostCustomerTable.$inferSelect;

export type HostCustomer = HostCustomerBase & {
  user: typeof userTable.$inferSelect;
  subscriptions: (typeof hostSubscriptionTable.$inferSelect)[];
};
