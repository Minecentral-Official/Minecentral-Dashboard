import 'server-only';

import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { hostSubscription, user } from '@/lib/db/schema';

//TODO: Hugo, IDK where this file goes, its technically only being used in host, but I think a subscription and a purchase should maybe be the same?
// FOR_ALAIN: Yeah, this place is fine.
// Also I've told you this already but you gotta learn the difference between 'use server' and import 'server-only'
// 'use server' is to create a server action, which means some sort of post method or mutation is running.
// This caaaan be used for queries, but is recommended not to, because:
// 1. We don't need to with server components
// 2. Get requests inherently have some internal caching, which your not going to be able to take advantage of with server function's post requests.
//
// import 'server-only' means this file, or module won't make it into the client build of our application, so our db related stuff won't be leaked to the browser

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
