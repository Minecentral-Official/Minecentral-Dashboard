import { resourceTable, user } from '@/lib/db/schema';

type ResourceBase = typeof resourceTable.$inferSelect;

export type Resource = ResourceBase & {
  user: typeof user.$inferSelect;
  // subscriptions: (typeof hostSubscription.$inferSelect)[];
};
