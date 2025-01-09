import 'server-only';

import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { hostSubscription } from '@/lib/db/schema';

export async function hostUpdateSubscription({
  stripeSubscriptionId,
  pterodactylServerId,
  pterodactylServerUuid,
}: {
  stripeSubscriptionId: string;
  pterodactylServerId: string;
  pterodactylServerUuid: string;
}) {
  const result = await db
    .update(hostSubscription)
    .set({
      pterodactylServerId,
      pterodactylServerUuid,
    })
    .where(eq(hostSubscription.stripeSubscriptionId, stripeSubscriptionId))
    .returning();

  return result;
}
