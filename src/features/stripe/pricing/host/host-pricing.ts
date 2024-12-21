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

export default async function hostPricing() {
  //Get all active prices (not products because Stripe is weird)
  const { data: prices } = await stripeAPI.prices.list({
    active: true,
    expand: ['data.product'],
    limit: 100,
  });
  //Create a list of products from prices
  const products: Product_Host[] = [];
  for (const price of prices) {
    //Find if product from this price already exists
    const product = products.find(
      (product) => product.id == (price.product as Stripe.Product).id,
    );
    if (product) {
      //Add price to existing product
      addPriceToProduct(product, price);
    } else {
      //Create a product from price
      const stripeProduct = price.product as Stripe.Product;
      if (!stripeProduct.active) continue;

      const newProduct = productToHostProduct(
        stripeProductToMCProduct(stripeProduct),
        parseProductMetadata(stripeProduct.metadata),
      );
      addPriceToProduct(newProduct, price);
      products.push(newProduct);
    }
  }

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

function productToHostProduct(
  product: Product,
  metadata: Product_HostMetadata,
): Product_Host {
  return { ...product, metadata };
}

function addPriceToProduct(product: Product_Host, price: Stripe.Price): void {
  //Add price to existing product

  if (!product.prices) product.prices = [];
  product.prices.push(convertPrice(price));
}

function convertPrice(price: Stripe.Price): Price {
  return {
    id: price.id,
    price: price.unit_amount,
  };
}
