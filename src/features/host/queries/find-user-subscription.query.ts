import 'server-only';

import { eq } from 'drizzle-orm';

import { hostSubscription } from '@/features/host/schemas/host-subscription.table';
import { user as userTable } from '@/lib/auth/schema/auth.table';
import { db } from '@/lib/db';

// *Note for Alain:
// ==================================================
// Lets keep the naming for 'id' camel case, as in 'Id'. This is completely opinionated,
// but the reason I want it this way is because of drizzle's auto casing.
// drizzle detects camel case and is able to turn it into other casings.
// this way, we can keep column naming for drizzle schemas, various variables throughout are app,
// and function names like here consistent
// ==================================================

export default async function findUserBySubscriptionId({
  subId,
}: {
  subId: string;
}) {
  const hostSub = await db.query.hostSubscription.findFirst({
    where: eq(hostSubscription.subscriptionId, subId),
  });

  if (hostSub) {
    //Return a user if subscription exists
    const user = await db.query.user.findFirst({
      where: eq(userTable.id, hostSub.userId),
    });

    // *Note for Alain:
    // ======================================
    // Difference between ?? and || is that:
    // '||' works for all falsy values, including 0 and other possibly unintentional values, which may result in bugs
    // '??' only works for null or undefined, and should be used in most cases unless specifically checking for all falsy values
    // ======================================

    return user ?? null;
  } else {
    //Return null if no sub exists
    return null;
  }
}
