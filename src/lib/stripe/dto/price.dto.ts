import 'server-only';

// DTO = Data Transfer Object

import type Stripe from 'stripe';

// function to filter out data that we actually need
export default function DTOPriceStripe({
  id,
  unit_amount,
  product,
  recurring,
}: Stripe.Price) {
  let productId: typeof product | null;

  // check that the type of price.product is of type string
  // not sure if this is the right way to go about it, idk enough about stripe but
  // all my test data has come out as price.product is of type string
  if (typeof product !== 'string') {
    productId = null;
  } else {
    productId = product;
  }

  return {
    id,
    price: unit_amount,
    productId,
    recurring_interval: recurring?.interval_count,
  };
}
