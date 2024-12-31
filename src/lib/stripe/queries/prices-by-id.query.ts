import { stripeAPI } from '@/lib/stripe/api/stripe.api';
import priceDTO from '@/lib/stripe/dto/price.dto';

import 'server-only';

// This used to take in a whole product
// To make this more reusable, I make it take in productId which is a simple string
// This way we don't need to worry about the Product Type in the future

// Also I put this in general because it is not host specific
export default async function getPricesFromProductId(productId: string) {
  const { data: prices } = await stripeAPI.prices.list({
    product: productId,
    active: true,
    limit: 100,
  });

  return prices.map((price) => priceDTO(price));
}
