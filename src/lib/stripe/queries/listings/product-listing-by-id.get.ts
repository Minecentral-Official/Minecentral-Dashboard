import { stripeAPI } from '@/lib/stripe/api/stripe.api';

import 'server-only';

export default async function stripeGetProductById(productId: string) {
  const product = await stripeAPI.products.retrieve(productId);
  return product;
}
