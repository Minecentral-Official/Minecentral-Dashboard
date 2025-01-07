import { db } from '@/lib/db';
import { hostSubscription } from '@/lib/db/schema';

import 'server-only';

// This one we'd want it to be a server action, so just 'use server at the top'
// import 'server-only';

//Adds a server for a user

export default async function createHostSubscription({
  userId,
  subscriptionId,
}: {
  userId: string;
  subscriptionId: string;
}) {
  // just returning here to satisfy eslint unused vars rule. Eventually this will connect to db and create a server for a user

  const result = await db
    .insert(hostSubscription)
    .values({
      userId,
      subscriptionId,
    })
    .returning();

  return result;
}
