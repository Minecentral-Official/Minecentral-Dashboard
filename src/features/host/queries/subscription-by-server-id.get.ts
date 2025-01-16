import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { hostSubscription } from '@/lib/db/schema';

import 'server-only';

export default async function hostGetSubscriptionByServerId(serverId: number) {
  const subscription = await db.query.hostSubscription.findFirst({
    where: eq(hostSubscription.pterodactylServerId, serverId),
    with: { customer: { with: { subscriptions: true, user: true } } },
  });
  return subscription;
}
