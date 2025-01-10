import Stripe from 'stripe';

import { HostSubscription } from '@/lib/db/schema';

export type THostPayment = {
  stripeSubscription: Stripe.Subscription;
  stripeCustomer: Stripe.Customer;
  hostSubscription: HostSubscription | undefined;
};
