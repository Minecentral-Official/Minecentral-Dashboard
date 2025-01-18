import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { hostSubscriptionTable } from '@/lib/db/schema';

import 'server-only';

export default async function hostGetSubscriptionByStripeId(
  stripeSubscriptionId: string,
) {
  const hostSubscription = await db.query.hostSubscriptionTable.findFirst({
    where: eq(hostSubscriptionTable.stripeSubscriptionId, stripeSubscriptionId),
    with: { customer: { with: { user: true, subscriptions: true } } },
  });
  return hostSubscription;
}
