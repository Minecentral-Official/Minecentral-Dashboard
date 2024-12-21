import Stripe from 'stripe';

import { stripeAPI } from '@/features/stripe/lib/stripe.api';

export default async function hostPricingTypesafe() {
  //Get all active prices (not products because Stripe is weird)
  const products = await getAllProducts();

  const productsWithPrices = await Promise.all(
    products.map(async (product) => ({
      product,
      prices: await getPricesFromProduct(product),
    })),
  );
  return productsWithPrices;
}

async function getAllProducts() {
  const { data: products } = await stripeAPI.products.list({
    active: true,
    limit: 100,
  });
  return products;
}

async function getPricesFromProduct(product: Stripe.Product) {
  const { data: price } = await stripeAPI.prices.list({
    product: product.id,
    limit: 100,
  });
  return price;
}
