import { stripeAPI } from '@/stripe/lib/stripe.api';

import 'server-only';

export default async function getSubscriptionById(sub_id: string) {
  return await stripeAPI.subscriptions.retrieve(sub_id);
}
