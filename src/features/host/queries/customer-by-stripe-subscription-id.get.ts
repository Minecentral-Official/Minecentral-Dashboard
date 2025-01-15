import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { hostSubscription } from '@/lib/db/schema';

import 'server-only';

export default async function hostGetCustomerByStripeSubscriptionId(
  stripeSubId: string,
) {
  const user = await db.query.hostSubscription.findFirst({
    where: eq(hostSubscription.stripeSubscriptionId, stripeSubId),
  });
  return user;
}
