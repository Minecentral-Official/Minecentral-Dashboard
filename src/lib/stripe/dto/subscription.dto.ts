import type Stripe from 'stripe';

export function DTOSubscriptionStripe({
  id,
}: Stripe.Response<Stripe.Subscription>) {
  return { id };
}
