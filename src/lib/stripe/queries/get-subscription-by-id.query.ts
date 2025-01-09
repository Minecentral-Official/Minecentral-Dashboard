import { stripeAPI } from '@/lib/stripe/api/stripe.api';

import 'server-only';

export default async function getStripeSubscriptionById(sub_id: string) {
  return await stripeAPI.subscriptions.retrieve(sub_id, {
    expand: ['customer'],
  });
}
