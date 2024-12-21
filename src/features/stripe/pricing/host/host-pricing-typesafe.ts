import Stripe from 'stripe';

import { stripeAPI } from '@/features/stripe/lib/stripe.api';
import { Price } from '@/features/stripe/types/price';
import { Product } from '@/features/stripe/types/product';
import {
  Product_Host,
  Product_HostMetadata,
} from '@/features/stripe/types/product-host';
import { parseProductMetadata } from '@/features/stripe/utils/parse-product-host-metadata';
import { stripeProductToMCProduct } from '@/features/stripe/utils/stripe-product-to-mc-product';

export default async function hostPricingTypesafe(): Promise<Product_Host[]> {
  //Get all active prices (not products because Stripe is weird)
  const stripeProducts = await getAllProducts();

  const products = await Promise.all(
    stripeProducts.map(async (product) => ({
      ...productToHostProduct(
        stripeProductToMCProduct(product),
        parseProductMetadata(product.metadata),
      ),
      prices: await getPricesFromProduct(product),
    })),
  );

  //Sort them bruh
  products.sort((a, b) => {
    const aRam = a.metadata.ram;
    const bRam = b.metadata.ram;
    if (!aRam) return 1; // Move 'a' to the end if its value is 0
    if (!bRam) return -1; // Move 'b' to the end if its value is 0
    // console.log(aPrice, bPrice);
    return aRam - bRam;
  });

  products.forEach((product) => {
    product.prices.sort((a, b) => {
      return (a.price || 0) - (b.price || 0);
    });
  });

  return products;
}

async function getAllProducts() {
  const { data: products } = await stripeAPI.products.list({
    active: true,
    limit: 100,
  });
  return products;
}

async function getPricesFromProduct(product: Stripe.Product): Promise<Price[]> {
  const { data: price } = await stripeAPI.prices.list({
    product: product.id,
    active: true,
    limit: 100,
  });

  return price.map((price) => convertPrice(price));
}

function convertPrice(price: Stripe.Price): Price {
  return {
    id: price.id,
    price: price.unit_amount,
  };
}

function productToHostProduct(
  product: Product,
  metadata: Product_HostMetadata,
): Product_Host {
  return { ...product, metadata };
}
