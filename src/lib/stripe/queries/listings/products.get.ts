'use cache';

import { cacheLife } from '@/lib/cache/cache-exports';
import { stripeAPI } from '@/lib/stripe/api/stripe.api';
import DTOProductStripe from '@/lib/stripe/dto/product.dto';

import 'server-only';

export default async function stripeGetProducts() {
  cacheLife('days');
  // Get all the products
  const { data: rawProducts } = await stripeAPI.products.list({
    active: true,
    limit: 100,
  });

  // Filter products
  const filteredProducts = rawProducts.map((rawProduct) =>
    DTOProductStripe(rawProduct),
  );

  return filteredProducts;
}
