import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { hostSubscriptionTable } from '@/lib/db/schema';

import 'server-only';

export default async function hostGetSubscriptionByPterodactylId(
  serverId: number,
) {
  const hostSubscription = await db.query.hostSubscriptionTable.findFirst({
    where: eq(hostSubscriptionTable.pterodactylServerId, serverId),
    with: { customer: { with: { subscriptions: true, user: true } } },
  });
  return hostSubscription;
}
