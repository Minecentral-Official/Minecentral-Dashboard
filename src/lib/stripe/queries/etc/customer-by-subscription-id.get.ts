'use cache';

import { cacheLife } from '@/lib/cache/cache-exports';
import { stripeAPI } from '@/lib/stripe/api/stripe.api';
import stripeGetSubscriptionById from '@/lib/stripe/queries/purchases/subscription-by-id.get';

import 'server-only';

export default async function stripeGetCustomerBySubscriptionId(subId: string) {
  cacheLife('days');
  const { customer } = await stripeGetSubscriptionById(subId);

  if (typeof customer !== 'string') {
    throw new Error(
      'subscription.customer has been expanded and is not type of string',
    );
  }

  return await stripeAPI.customers.retrieve(customer);
}
