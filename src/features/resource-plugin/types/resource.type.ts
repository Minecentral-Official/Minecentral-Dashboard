import { pluginTable, user } from '@/lib/db/schema';

type ResourceBase = typeof pluginTable.$inferSelect;

export type Resource = ResourceBase & {
  user: typeof user.$inferSelect;
  // subscriptions: (typeof hostSubscription.$inferSelect)[];
};
