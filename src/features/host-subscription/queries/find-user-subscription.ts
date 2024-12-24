'use server';

import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { hostSubscription, user } from '@/lib/db/schema';

//TODO: Hugo, IDK where this file goes, its technically only being used in host, but I think a subscription and a purchase should maybe be the same?

//Returns a user via their sub-id
export default async function findUserBySubscriptionID({
  sub_id,
}: {
  sub_id: string;
}) {
  const host_sub = await db.query.hostSubscription.findFirst({
    where: eq(hostSubscription.subscriptionId, sub_id),
  });
  if (host_sub) {
    //Return a user if subscription exists
    const _user = await db.query.user.findFirst({
      where: eq(user.id, host_sub?.userId),
    });
    return _user || null;
  } else {
    //Return null if no sub exists
    return null;
  }
}
