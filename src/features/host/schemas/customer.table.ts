import { relations } from 'drizzle-orm';
import { integer, pgTable, text } from 'drizzle-orm/pg-core';

import { hostSubscriptionTable, user } from '@/lib/db/schema';

export const hostCustomerTable = pgTable('hostCustomer', {
  id: integer().primaryKey().generatedAlwaysAsIdentity({ startWith: 1000 }),
  userId: text()
    .notNull()
    .references(() => user.id),
  //Stripe Customer ID
  stripeCustomerId: text().notNull(),
  //Pterodactyl User ID
  pterodactylUserId: integer().notNull(),
});

export const hostCustomerRelations = relations(
  hostCustomerTable,
  ({ one, many }) => ({
    user: one(user, {
      fields: [hostCustomerTable.userId],
      references: [user.id],
    }),
    subscriptions: many(hostSubscriptionTable),
  }),
);

type HostCustomerBase = typeof hostCustomerTable.$inferSelect;

export type HostCustomer = HostCustomerBase & {
  user: typeof user.$inferSelect;
  subscriptions: (typeof hostSubscriptionTable.$inferSelect)[];
};
