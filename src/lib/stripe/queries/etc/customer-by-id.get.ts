'use cache';

import { cacheLife } from '@/lib/cache/cache-exports';
import { stripeAPI } from '@/lib/stripe/api/stripe.api';

import 'server-only';

export default async function stripeGetCustomer(customerId: string) {
  cacheLife('days');
  return await stripeAPI.customers.retrieve(customerId);
}
