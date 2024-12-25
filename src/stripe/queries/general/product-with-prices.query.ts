import getPrices from '@/stripe/queries/general/prices.query';
import getProducts from '@/stripe/queries/general/products.query';

import 'server-only';

export default async function getProductsWithPrices() {
  // get all products and get all prices
  const productsPromise = getProducts();
  const pricesPromise = getPrices();

  // await both products and prices
  const [products, prices] = await Promise.all([
    productsPromise,
    pricesPromise,
  ]);

  // combine products and prices
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
