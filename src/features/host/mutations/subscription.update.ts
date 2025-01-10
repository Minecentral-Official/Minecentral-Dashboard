import 'server-only';

import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { hostSubscription } from '@/lib/db/schema';

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
    .update(hostSubscription)
    .set({
      pterodactylServerId,
      pterodactylServerUuid,
    })
    .where(eq(hostSubscription.id, hostId))
    .returning();

  return result;
}
