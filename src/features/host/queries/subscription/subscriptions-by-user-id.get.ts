import { eq } from 'drizzle-orm';

import hostGetCustomerByUserId from '@/features/host/queries/customer/customer-by-user-id.get';
import { db } from '@/lib/db';
import { hostSubscriptionTable } from '@/lib/db/schema';

import 'server-only';

export default async function hostSubscriptionsByUserId(userId: string) {
  const hostCustomer = await hostGetCustomerByUserId(userId);
  if (!hostCustomer) return [];
  const subscriptions = await db.query.hostSubscriptionTable.findMany({
    where: eq(hostSubscriptionTable.hostCustomerId, hostCustomer.id),
    with: { customer: { with: { user: true, subscriptions: true } } },
  });
  return subscriptions;
}
