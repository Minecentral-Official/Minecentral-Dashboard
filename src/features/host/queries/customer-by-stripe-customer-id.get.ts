import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { hostCustomer } from '@/lib/db/schema';

import 'server-only';

export default async function hostGetCustomerByStripeCustomerId(
  stripeCustomerId: string,
) {
  const user = await db.query.hostCustomer.findFirst({
    where: eq(hostCustomer.stripeCustomerId, stripeCustomerId),
  });
  return user;
}
