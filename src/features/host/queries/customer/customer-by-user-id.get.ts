import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { hostCustomer } from '@/lib/db/schema';

import 'server-only';

export default async function hostGetCustomerByUserId(userId: string) {
  const customer = await db.query.hostCustomer.findFirst({
    where: eq(hostCustomer.userId, userId),
    with: { subscriptions: true, user: true },
  });
  return customer;
}
