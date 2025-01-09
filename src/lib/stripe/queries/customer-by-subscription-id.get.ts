import { stripeAPI } from '@/lib/stripe/api/stripe.api';
import getStripeSubscriptionById from '@/lib/stripe/queries/get-subscription-by-id.query';

import 'server-only';

export default async function getStripeCustomerBySubscriptionId(
  sub_id: string,
) {
  const subscription = await getStripeSubscriptionById(sub_id);
  return await stripeAPI.customers.retrieve(subscription.customer as string);
}
