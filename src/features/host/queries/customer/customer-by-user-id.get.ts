'use cache';

import { eq } from 'drizzle-orm';

import { cacheLife } from '@/lib/cache/cache-exports';
import { db } from '@/lib/db';
import { hostCustomerTable } from '@/lib/db/schema';

import 'server-only';

export default async function hostGetCustomerByUserId(userId: string) {
  cacheLife('hours');
  const hostCustomer = await db.query.hostCustomerTable.findFirst({
    where: eq(hostCustomerTable.userId, userId),
    with: { subscriptions: true, user: true },
  });
  return hostCustomer;
}
