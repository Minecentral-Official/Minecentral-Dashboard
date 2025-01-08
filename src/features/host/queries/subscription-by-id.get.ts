import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { hostSubscription } from '@/lib/db/schema';

import 'server-only';

export default async function hostGetSubscriptionById(
  stripeSubscriptionId: string,
) {
  const subscription = await db.query.hostSubscription.findFirst({
    where: eq(hostSubscription.stripeSubscriptionId, stripeSubscriptionId),
  });
  return subscription;
}
