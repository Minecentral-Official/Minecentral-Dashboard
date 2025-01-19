'use cache';

import { cacheLife } from '@/lib/cache/cache-exports';
import DTOProductWithPricesStripe from '@/lib/stripe/dto/product-with-prices.dto';
import stripeGetPrices from '@/lib/stripe/queries/listings/prices.get';
import stripeGetProducts from '@/lib/stripe/queries/listings/products.get';

import 'server-only';

export default async function stripeGetProductsWithPrices() {
  cacheLife('days');
  // get all products and get all prices
  const productsPromise = stripeGetProducts();
  const pricesPromise = stripeGetPrices();

  // await both products and prices
  const [products, prices] = await Promise.all([
    productsPromise,
    pricesPromise,
  ]);

  return products.map((product) => DTOProductWithPricesStripe(product, prices));
}
