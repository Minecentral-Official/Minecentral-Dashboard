import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { hostSubscription } from '@/lib/db/schema';

import 'server-only';

export default async function hostGetServerIdBySubscriptionId(subId: string) {
  const hostSubscriptionData = await db.query.hostSubscription.findFirst({
    where: eq(hostSubscription.stripeSubscriptionId, subId),
  });
  if (!hostSubscriptionData)
    throw new Error('No Host Subscription via this id');
  const serverId = hostSubscriptionData.pterodactylServerId;
  if (!serverId) throw new Error('Server ID is not yet set!');
  return serverId;
}
