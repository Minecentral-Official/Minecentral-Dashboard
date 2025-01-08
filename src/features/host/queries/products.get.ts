import getProductsWithPrices from '@/lib/stripe/queries/product-with-prices.query';
import { metadataHostSchema } from '@/lib/stripe/schemas/host-metadata.zod';

import 'server-only';

export default async function hostGetProducts() {
  const products = await getProductsWithPrices();

  const parsedProducts = products.map(({ metadata, ...rest }) => {
    const parsedMetadata = metadataHostSchema.parse(metadata);
    return {
      metadata: parsedMetadata,
      ...rest,
    };
  });

  return parsedProducts;
}
