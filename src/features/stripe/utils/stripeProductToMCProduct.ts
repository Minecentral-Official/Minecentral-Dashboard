import Stripe from 'stripe';

import { Product } from '../types/product';

export function stripeProductToMCProduct(product: Stripe.Product): Product {
  console.log(product.default_price);
  return {
    id: product.id,
    default_price: (product.default_price as string) || '',
    description: product.description || '',
    images: product.images[0] || '',
    name: product.name,
    prices: [],
  };
}
