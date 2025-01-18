import 'server-only';

import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { hostSubscriptionTable } from '@/lib/db/schema';

export async function hostUpdateSubscription({
  hostId,
  pterodactylServerId,
  pterodactylServerUuid,
}: {
  hostId: number;
  pterodactylServerId: number;
  pterodactylServerUuid: string;
}) {
  const result = await db
    .update(hostSubscriptionTable)
    .set({
      pterodactylServerId,
      pterodactylServerUuid,
    })
    .where(eq(hostSubscriptionTable.id, hostId))
    .returning();

  return result;
}
