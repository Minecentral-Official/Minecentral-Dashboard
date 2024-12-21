'use server';

import { stripeAPI } from '@/features/stripe/lib/stripe.api';

export default async function getHostProducts() {
  const { data } = await stripeAPI.products.list({
    expand: ['data.prices'],
  });
  return data;
}
