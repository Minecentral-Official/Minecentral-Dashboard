import { DTOCustomerStripe } from '@/lib/stripe/dto/customer.dto';
import DTOPriceStripe from '@/lib/stripe/dto/price.dto';
import DTOProductStripe from '@/lib/stripe/dto/product.dto';

import type Stripe from 'stripe';

export function DTOSubscriptionStripe({
  id,
  items: { data },
  customer,
}: Stripe.Response<Stripe.Subscription>) {
  const product = data.map(({ plan, price }) => {
    return {
      product: DTOProductStripe(plan.product as Stripe.Product),
      price: DTOPriceStripe(price),
    };
  });
  return {
    id,
    product,
    customer: DTOCustomerStripe(customer as Stripe.Customer),
  };
}
