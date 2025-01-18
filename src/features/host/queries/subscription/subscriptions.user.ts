import { eq } from 'drizzle-orm';

import hostGetCustomerByUserId from '@/features/host/queries/customer/customer-by-user-id.get';
import validateSession from '@/lib/auth/helpers/validate-session';
import { db } from '@/lib/db';
import { hostSubscriptionTable } from '@/lib/db/schema';

import 'server-only';

export default async function hostUserListSubscriptions() {
  const { user } = await validateSession();
  const hostCustomer = await hostGetCustomerByUserId(user.id);
  if (!hostCustomer) return [];
  const subscriptions = await db.query.hostSubscriptionTable.findMany({
    where: eq(hostSubscriptionTable.hostCustomerId, hostCustomer.id),
    with: { customer: { with: { user: true, subscriptions: true } } },
  });
  return subscriptions;
}
