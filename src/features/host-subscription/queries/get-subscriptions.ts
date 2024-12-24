'use server';

import { eq } from 'drizzle-orm';

import getSession from '@/auth/lib/get-session';
import { db } from '@/lib/db';
import { hostSubscription } from '@/lib/db/schema';

//Returns all of a users subscriptions
export default async function getHostSubscriptions() {
  const potentialSession = await getSession();
  if (!potentialSession) {
    throw new Error('no session found');
  }
  const { user } = potentialSession;
  const subscriptions = await db.query.hostSubscription.findMany({
    where: eq(hostSubscription.userId, user.id),
  });

  return subscriptions;
}
