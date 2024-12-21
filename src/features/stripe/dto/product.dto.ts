import 'server-only';

import type Stripe from 'stripe';

// function for filtering product fields
export default function productDTO({
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
