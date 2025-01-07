import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { hostSubscription } from '@/lib/db/schema';

import 'server-only';

export default async function getSubscriptionById(subscriptionId: string) {
  const subscription = await db.query.hostSubscription.findFirst({
    where: eq(hostSubscription.subscriptionId, subscriptionId),
  });
  return subscription;
}
