import { timestamp, uuid } from 'drizzle-orm/pg-core';

// New v2 tables use these factories; legacy IDs/column names remain unchanged.
export function identityColumns() {
  return { id: uuid('id').defaultRandom().primaryKey() };
}
export function lifecycleColumns() {
  return {
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
    archivedAt: timestamp('archived_at', { withTimezone: true }),
  };
}
