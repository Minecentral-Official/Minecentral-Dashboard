import { DTOProductHost } from '@/features/host/dto/host-product.dto';
import getProductsWithPrices from '@/lib/stripe/queries/listings/product-listing-with-prices.get';

import 'server-only';

export default async function hostGetProducts() {
  const products = await getProductsWithPrices();

  return products.map((product) => {
    return DTOProductHost(product);
  });
}
