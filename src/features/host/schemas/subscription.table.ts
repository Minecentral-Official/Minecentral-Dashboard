import { relations } from 'drizzle-orm';
import { integer, pgTable, text } from 'drizzle-orm/pg-core';

import { hostCustomer } from '@/features/host/schemas/customer.table';

export const hostSubscription = pgTable('hostSubscription', {
  id: integer().primaryKey().generatedAlwaysAsIdentity({ startWith: 1000 }),
  //Pterodactyl supplied data, ID for data grabbing and UUID for url linking
  pterodactylServerId: text(),
  pterodactylServerUuid: text(),
  //Stripe Subscription ID
  stripeSubscriptionId: text().notNull(),
  //The Host Customer who purchased this
  hostCustomerId: integer()
    .references(() => hostCustomer.id)
    .notNull(),
});

export const hostRelations = relations(hostSubscription, ({ one }) => ({
  customer: one(hostCustomer, {
    fields: [hostSubscription.hostCustomerId],
    references: [hostCustomer.id],
  }),
}));
