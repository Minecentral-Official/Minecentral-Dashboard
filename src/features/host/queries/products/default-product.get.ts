import { DTOProductDefault } from '@/features/host/dto/default-product.dto';
import hostGetProducts from '@/features/host/queries/products/products.get';

import 'server-only';

export async function hostGetDefaultProducts() {
  const products = await hostGetProducts();
  const filteredDefaultProducts = products.map((product) =>
    DTOProductDefault(product),
  ).reverse();
  return filteredDefaultProducts;
}
