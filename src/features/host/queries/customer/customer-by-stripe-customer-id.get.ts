import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { hostCustomerTable } from '@/lib/db/schema';

import 'server-only';

export default async function hostGetCustomerByStripeCustomerId(
  stripeCustomerId: string,
) {
  const hostCustomer = await db.query.hostCustomerTable.findFirst({
    where: eq(hostCustomerTable.stripeCustomerId, stripeCustomerId),
    with: { subscriptions: true, user: true },
  });
  return hostCustomer;
}
