'use cache';

import { cacheLife } from '@/lib/cache/cache-exports';
import { stripeAPI } from '@/lib/stripe/api/stripe.api';

import 'server-only';

export default async function getStripeSubscriptionById(subId: string) {
  cacheLife('days');
  const subscription = await stripeAPI.subscriptions.retrieve(subId, {
    expand: ['customer', 'items.data.plan.product'],
  });

  return subscription;
}
