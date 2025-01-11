import { stripeAPI } from '@/lib/stripe/api/stripe.api';
import getStripeSubscriptionById from '@/lib/stripe/queries/purchases/user-subscription-by-id.get';

import 'server-only';

export default async function getStripeCustomerBySubscriptionId(subId: string) {
  const { customer } = await getStripeSubscriptionById(subId);

  if (typeof customer !== 'string') {
    throw new Error(
      'subscription.customer has been expanded and is not type of string',
    );
  }

  return await stripeAPI.customers.retrieve(customer);
}
