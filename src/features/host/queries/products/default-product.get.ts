import { DTOProductDefault } from '@/features/host/dto/default-product.dto';
import hostGetProducts from '@/features/host/queries/products/products.get';

import 'server-only';

export async function hostGetDefaultProducts() {
  const products = await hostGetProducts();
  const defaultProducts = products.filter(
    ({ metadata }) => metadata.isDefaultPlan,
  );
  const filteredDefaultProducts = defaultProducts.map((product) =>
    DTOProductDefault(product),
  );
  return filteredDefaultProducts;
}
