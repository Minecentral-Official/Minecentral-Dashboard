import 'server-only';

import Stripe from 'stripe';

import { serverEnv } from '@/lib/env/server.env';

// Legacy helpers fail only when used; unrelated pages need no Stripe credentials.
export const stripeAPI = new Proxy({} as Stripe, {
  get(_target, property) {
    if (!serverEnv.STRIPE_SECRET_KEY)
      throw new Error('Stripe is not configured');
    const client = new Stripe(serverEnv.STRIPE_SECRET_KEY);
    return Reflect.get(client, property);
  },
});
