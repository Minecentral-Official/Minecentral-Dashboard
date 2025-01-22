import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { hostSubscriptionTable } from '@/lib/db/schema';

import 'server-only';

export default async function hostGetSubscriptionByStripeSubscriptionId(
  stripeSubId: string,
) {
  const hostSubscription = await db.query.hostSubscriptionTable.findFirst({
    where: eq(hostSubscriptionTable.stripeSubscriptionId, stripeSubId),
    with: {
      customer: { with: { subscriptions: true, user: true } },
    },
  });
  return hostSubscription;
}
