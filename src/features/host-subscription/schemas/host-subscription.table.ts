import { integer, pgTable, text } from 'drizzle-orm/pg-core';

import { user } from '@/auth/schema/auth.table';

export const hostSubscription = pgTable('hostSubscription', {
  id: integer().primaryKey().generatedAlwaysAsIdentity({ startWith: 1000 }),
  userId: integer()
    .notNull()
    .references(() => user.id),
  serverId: text().notNull(),
  // because drizzle auto generates column names based on casing, I'm using camel case here
  serverUuid: text().notNull(),
});
