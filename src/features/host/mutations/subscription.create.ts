import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import {
  HostCustomer,
  hostCustomerTable,
  HostSubscription,
  hostSubscriptionTable,
} from '@/lib/db/schema';

import 'server-only';

export async function hostCreateSubscription({
  hostCustomer,
  stripeSubscriptionId,
  pterodactylServerId,
  pterodactylServerUuid,
}: {
  hostCustomer: HostCustomer;
  stripeSubscriptionId: string;
  pterodactylServerId?: number;
  pterodactylServerUuid?: string;
}): Promise<HostSubscription | undefined> {
  const result = await db.transaction(async (tx) => {
    const subscription = await tx
      .insert(hostSubscriptionTable)
      .values({
        hostCustomerId: hostCustomer.id,
        stripeSubscriptionId,
        pterodactylServerId,
        pterodactylServerUuid,
      })
      .returning();

    const query = await tx.query.hostSubscriptionTable.findFirst({
      where: eq(hostCustomerTable.id, subscription[0].id),
      with: { customer: { with: { subscriptions: true, user: true } } },
    });

    return query;
  });

  return result;
}
