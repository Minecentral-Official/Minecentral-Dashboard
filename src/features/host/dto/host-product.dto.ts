import DTOProductStripe from '@/lib/stripe/dto/product.dto';
import { metadataHostSchema } from '@/lib/stripe/schemas/host-metadata.zod';

export function DTOProductHost({
  metadata,
  ...restProduct
}: ReturnType<typeof DTOProductStripe> & {
  prices: {
    id: string;
    price: number | null;
  }[];
}) {
  const validatedMetadata = metadataHostSchema.parse(metadata);
  return { ...restProduct, metadata: validatedMetadata };
}

export type MCProduct_Host = ReturnType<typeof DTOProductHost>;
