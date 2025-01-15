import { eq } from 'drizzle-orm';

import { pterodactylGetServerById } from '@/features/host/lib/pterodactyl/queries/server-by-id.get';
import { db } from '@/lib/db';
import { hostSubscription } from '@/lib/db/schema';

import 'server-only';

export default async function hostGetServerBySubscriptionId(subId: string) {
  const hostSubscriptionData = await db.query.hostSubscription.findFirst({
    where: eq(hostSubscription.stripeSubscriptionId, subId),
  });
  if (!hostSubscriptionData)
    throw new Error('No Host Subscription via this id');
  const serverId = hostSubscriptionData.pterodactylServerId;
  if (!serverId) throw new Error('Server ID is not yet set!');
  return await pterodactylGetServerById(serverId);
}
