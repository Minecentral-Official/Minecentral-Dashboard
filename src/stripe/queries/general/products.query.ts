import productDTO from '@/stripe/dto/product.dto';
import { stripeAPI } from '@/stripe/lib/stripe.api';

import 'server-only';

export default async function getProducts() {
  // Get all the products
  const { data: rawProducts } = await stripeAPI.products.list({
    active: true,
    limit: 100,
  });

  // Filter products
  const filteredProducts = rawProducts.map((rawProduct) =>
    productDTO(rawProduct),
  );

  return filteredProducts;
}
