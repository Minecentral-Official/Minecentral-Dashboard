import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { hostSubscription } from '@/lib/db/schema';

import 'server-only';

export default async function hostGetSubscriptionByStripeId(
  stripeSubscriptionId: string,
) {
  const subscription = await db.query.hostSubscription.findFirst({
    where: eq(hostSubscription.stripeSubscriptionId, stripeSubscriptionId),
    with: { customer: { with: { user: true, subscriptions: true } } },
  });
  return subscription;
}
