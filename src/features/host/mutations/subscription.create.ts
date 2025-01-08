import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { hostCustomer, hostSubscription } from '@/lib/db/schema';

import 'server-only';

export default async function hostCreateSubscription({
  hostCustomerId,
  stripeSubscriptionId,
  pterodactylServerId,
  pterodactylServerUuid,
}: {
  hostCustomerId: number;
  stripeSubscriptionId: string;
  pterodactylServerId?: string;
  pterodactylServerUuid?: string;
}) {
  const result = await db.transaction(async (tx) => {
    const subscription = await tx
      .insert(hostSubscription)
      .values({
        hostCustomerId,
        stripeSubscriptionId,
        pterodactylServerId,
        pterodactylServerUuid,
      })
      .returning();

    const query = await tx.query.hostCustomer.findFirst({
      where: eq(hostCustomer.id, subscription[0].id),
      with: { subscriptions: true, user: true },
    });
    return query;
  });

  return result;
}
