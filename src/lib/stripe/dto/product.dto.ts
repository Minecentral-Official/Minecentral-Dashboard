import 'server-only';

import type Stripe from 'stripe';

// function for filtering product fields
export default function DTOProductStripe({
  id,
  name,
  description,
  images,
  default_price,
  metadata,
}: Stripe.Product) {
  return {
    id,
    name,
    description,
    images,
    default_price,
    metadata,
  };
}

export type MCProduct_Stripe = ReturnType<typeof DTOProductStripe>;
