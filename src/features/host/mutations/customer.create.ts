import hostGetCustomerByUserId from '@/features/host/queries/customer/customer-by-user-id.get';
import { db } from '@/lib/db';
import { hostCustomerTable } from '@/lib/db/schema';

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

  await db
    .insert(hostCustomerTable)
    .values({
      userId,
      pterodactylUserId,
      stripeCustomerId,
    })
    .returning();

  return await hostGetCustomerByUserId(userId);
}
