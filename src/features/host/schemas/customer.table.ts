import { relations } from 'drizzle-orm';
import { integer, pgTable, text } from 'drizzle-orm/pg-core';

import { hostSubscription, user } from '@/lib/db/schema';

export const hostCustomer = pgTable('hostCustomer', {
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
  hostCustomer,
  ({ one, many }) => ({
    user: one(user, {
      fields: [hostCustomer.userId],
      references: [user.id],
    }),
    subscriptions: many(hostSubscription),
  }),
);

type HostCustomerBase = typeof hostCustomer.$inferSelect;

export type HostCustomer = HostCustomerBase & {
  user: typeof user.$inferSelect;
  subscriptions: (typeof hostSubscription.$inferSelect)[];
};
