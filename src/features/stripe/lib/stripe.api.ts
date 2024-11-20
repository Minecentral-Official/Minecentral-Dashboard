import Stripe from 'stripe';

import { serverEnv } from '@/lib/env/server.env';

export const stripeAPI = new Stripe(serverEnv.STRIPE_SECRET_KEY);
