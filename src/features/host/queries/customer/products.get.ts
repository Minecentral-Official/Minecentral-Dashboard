import { DTOProductHost } from '@/features/host/dto/host-product.dto';
import stripeGetProductsWithPrices from '@/lib/stripe/queries/listings/products-with-prices.get';

import 'server-only';

export default async function hostGetProducts() {
  const products = await stripeGetProductsWithPrices();

  return products.map((product) => {
    return DTOProductHost(product);
  });
}
