import getPrices from '@/features/stripe/queries/general/prices.query';
import getProducts from '@/features/stripe/queries/general/products.query';

import 'server-only';

export default async function getProductsWithPrices() {
  const productsPromise = getProducts();
  const pricesPromise = getPrices();

  const [products, prices] = await Promise.all([
    productsPromise,
    pricesPromise,
  ]);

  const productsWithPrices = products.map((product) => {
    // filter out products that are associated with a given product
    const pricesAssociatedWithProduct = prices.filter(
      ({ productId }) => productId === product.id,
    );

    // since they are attached, we no longer need productId in the price object
    const PricesWithNoProductId = pricesAssociatedWithProduct.map(
      ({ id, price }) => ({
        id,
        price,
      }),
    );

    return {
      ...product,
      prices: PricesWithNoProductId,
    };
  });

  // return finalized products with prices array
  return productsWithPrices;
}
