import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { customer, customerTypeColumnSuffix } from '@/lib/db/schema';
import { MinecentralServices } from '@/lib/types/minecentral-services.type';

import 'server-only';

export default async function getUserByCustomerId(
  customerId: string,
  type: MinecentralServices,
) {
  const user = db.query.customer.findFirst({
    where: eq(customer[`${type}${customerTypeColumnSuffix}`], customerId),
  });
  return user;
}
