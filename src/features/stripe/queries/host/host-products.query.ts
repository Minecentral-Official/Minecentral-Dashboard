import getProductsWithPrices from '@/features/stripe/queries/general/product-with-prices.query';
import { hostMetadataSchema } from '@/features/stripe/schemas/host-metadata.zod';

import 'server-only';

export default async function getHostProducts() {
  const products = await getProductsWithPrices();

  const parsedProducts = products.map(({ metadata, ...rest }) => {
    const parsedMetadata = hostMetadataSchema.parse(metadata);
    return {
      metadata: parsedMetadata,
      ...rest,
    };
  });
  return parsedProducts;
}
