import type Stripe from 'stripe';

export function subscriptionDTO({ id }: Stripe.Response<Stripe.Subscription>) {
  return { id };
}
