'use cache';

import { cacheLife } from '@/lib/cache/cache-exports';
import { stripeAPI } from '@/lib/stripe/api/stripe.api';

import 'server-only';

export default async function stripeGetProductById(productId: string) {
  cacheLife('days');
  const product = await stripeAPI.products.retrieve(productId);
  return product;
}
