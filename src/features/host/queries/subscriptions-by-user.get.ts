import { eq } from 'drizzle-orm';

import hostGetCustomerByUserId from '@/features/host/queries/customer-by-user-id.get';
import validateSession from '@/lib/auth/helpers/validate-session';
import { db } from '@/lib/db';
import { hostSubscription } from '@/lib/db/schema';

import 'server-only';

export default async function hostGetUserSubscriptions() {
  const { user } = await validateSession();
  const hostCustomer = await hostGetCustomerByUserId(user.id);
  if (!hostCustomer) return undefined;
  const subscriptions = await db.query.hostSubscription.findFirst({
    where: eq(hostSubscription.hostCustomerId, hostCustomer.id),
  });
  return subscriptions;
}
