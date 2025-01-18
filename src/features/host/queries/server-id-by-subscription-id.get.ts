import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { hostSubscriptionTable } from '@/lib/db/schema';

import 'server-only';

export default async function hostGetServerIdBySubscriptionId(subId: string) {
  const hostSubscriptionData = await db.query.hostSubscriptionTable.findFirst({
    where: eq(hostSubscriptionTable.stripeSubscriptionId, subId),
  });
  if (!hostSubscriptionData)
    throw new Error('No Host Subscription via this id');
  const serverId = hostSubscriptionData.pterodactylServerId;
  if (!serverId) throw new Error('Server ID is not yet set!');
  return serverId;
}
