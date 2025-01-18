import { relations } from 'drizzle-orm';
import { integer, pgTable, text } from 'drizzle-orm/pg-core';

import {
  HostCustomer,
  hostCustomerTable,
} from '@/features/host/schemas/customer.table';

export const hostSubscriptionTable = pgTable('hostSubscription', {
  id: integer().primaryKey().generatedAlwaysAsIdentity({ startWith: 1000 }),
  //Pterodactyl supplied data, ID for data grabbing and UUID for url linking
  pterodactylServerId: integer(),
  pterodactylServerUuid: text(),
  //Stripe Subscription ID
  stripeSubscriptionId: text().notNull(),
  //The Host Customer who purchased this
  hostCustomerId: integer()
    .references(() => hostCustomerTable.id)
    .notNull(),
});

export const hostSubscriptionRelations = relations(
  hostSubscriptionTable,
  ({ one }) => ({
    customer: one(hostCustomerTable, {
      fields: [hostSubscriptionTable.hostCustomerId],
      references: [hostCustomerTable.id],
    }),
  }),
);

type HostSubscriptionBase = typeof hostSubscriptionTable.$inferSelect;

export type HostSubscription = HostSubscriptionBase & {
  customer: HostCustomer;
};
