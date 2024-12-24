import { integer, pgTable, text } from 'drizzle-orm/pg-core';

import { user } from '@/auth/schema/auth.table';

export const hostSubscription = pgTable('hostSubscription', {
  id: integer().primaryKey().generatedAlwaysAsIdentity({ startWith: 1000 }),
  //The ID of the user that purchased a server
  userId: text()
    .notNull()
    .references(() => user.id),
  //Pterodactyl supplied data, ID for data grabbing and UUID for url linking
  serverId: text().notNull(),
  serverUuid: text().notNull(),
  //Stripe supplied data
  subscriptionId: text().notNull(),
});
