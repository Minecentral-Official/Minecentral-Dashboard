import { relations } from 'drizzle-orm';
import { pgTable, text } from 'drizzle-orm/pg-core';

import { minecentralServicesConfig } from '@/lib/configs/minecentral-services.config';
import { user } from '@/lib/db/schema';

import type { MinecentralServices } from '@/lib/types/minecentral-services.type';

export const customerTypeColumnSuffix = 'CustomerId';

const asdf = minecentralServicesConfig.reduce(
  (acc, curr) => {
    return { ...acc, [`${curr}${customerTypeColumnSuffix}`]: text() };
  },
  {} as Record<
    `${MinecentralServices}${typeof customerTypeColumnSuffix}`,
    ReturnType<typeof text>
  >,
);

export const customer = pgTable('customer', {
  userId: text()
    .notNull()
    .references(() => user.id),
  ...asdf,
});

export const customerRelations = relations(customer, ({ one }) => ({
  user: one(user, {
    fields: [customer.userId],
    references: [user.id],
  }),
}));
