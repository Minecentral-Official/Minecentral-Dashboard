import { integer, pgTable, text } from 'drizzle-orm/pg-core';

import { hostSubscriptionTable, user } from '@/lib/db/schema';

export const resourceRelease = pgTable('resourceRelease', {
  id: integer().primaryKey().generatedAlwaysAsIdentity({ startWith: 1000 }),
  userId: text()
    .notNull()
    .references(() => user.id),
  //Stripe Customer ID
  stripeCustomerId: text().notNull(),
  //Pterodactyl User ID
  pterodactylUserId: integer().notNull(),
});

// export const pluginPostRelations = relations(
//   hostCustomer,
//   ({ one, many }) => ({
//     user: one(user, {
//       fields: [hostCustomer.userId],
//       references: [user.id],
//     }),
//     subscriptions: many(hostSubscription),
//   }),
// );

type PluginPostBase = typeof resourceRelease.$inferSelect;

export type PluginPost = PluginPostBase & {
  user: typeof user.$inferSelect;
  subscriptions: (typeof hostSubscriptionTable.$inferSelect)[];
};
