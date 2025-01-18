'use cache';

import { cacheLife } from '@/lib/cache/cache-exports';
import { stripeAPI } from '@/lib/stripe/api/stripe.api';
import { DTOCustomerStripe } from '@/lib/stripe/dto/customer.dto';

import 'server-only';

export default async function stripeGetCustomer(customerId: string) {
  cacheLife('days');
  const stripeCustomer = await stripeAPI.customers.retrieve(customerId, {
    expand: ['subscriptions'],
  });

  // console.log('Stripe customer', stripeCustomer);

  if (!stripeCustomer) {
    throw new Error('No Stripe Customer found');
  }

  if (stripeCustomer?.deleted === true) {
    throw new Error('This customer has been deleted');
  }

  return DTOCustomerStripe(stripeCustomer);
}
