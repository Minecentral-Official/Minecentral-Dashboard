import { stripeAPI } from '@/lib/stripe/api/stripe.api';

import 'server-only';

export default async function getStripeSubscriptionById(subId: string) {
  const subscription = await stripeAPI.subscriptions.retrieve(subId, {
    expand: ['customer', 'items.data.plan.product'],
  });

  return subscription;
}
