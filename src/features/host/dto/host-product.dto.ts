import DTOProductWithPricesStripe from '@/lib/stripe/dto/product-with-prices.dto';
import { metadataHostSchema } from '@/lib/stripe/schemas/host-metadata.zod';

export function DTOProductHost({
  metadata,
  ...restProduct
}: ReturnType<typeof DTOProductWithPricesStripe>) {
  const validatedMetadata = metadataHostSchema.parse(metadata);
  return { ...restProduct, metadata: validatedMetadata };
}

export type MCProduct_Host = ReturnType<typeof DTOProductHost>;
