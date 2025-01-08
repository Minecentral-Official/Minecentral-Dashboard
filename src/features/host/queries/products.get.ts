import hostGetProducts from '@/lib/stripe/queries/product-with-prices.query';
import { metadataHostSchema } from '@/lib/stripe/schemas/host-metadata.zod';

import 'server-only';

export default async function getProductsHost() {
  const products = await hostGetProducts();

  const parsedProducts = products.map(({ metadata, ...rest }) => {
    const parsedMetadata = metadataHostSchema.parse(metadata);
    return {
      metadata: parsedMetadata,
      ...rest,
    };
  });
  return parsedProducts;
}
