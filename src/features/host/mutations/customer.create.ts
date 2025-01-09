import { db } from '@/lib/db';
import { hostCustomer } from '@/lib/db/schema';

import 'server-only';

export async function hostCreateCustomer({
  userId,
  pterodactylUserId,
  stripeCustomerId,
}: {
  userId: string;
  pterodactylUserId: number;
  stripeCustomerId: string;
}) {
  // just returning here to satisfy eslint unused vars rule. Eventually this will connect to db and create a server for a user

  const result = await db
    .insert(hostCustomer)
    .values({
      userId,
      pterodactylUserId,
      stripeCustomerId,
    })
    .returning();

  return result;
}
