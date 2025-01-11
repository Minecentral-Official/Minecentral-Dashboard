import getPrices from '@/lib/stripe/queries/listings/prices-listing.get';
import getProducts from '@/lib/stripe/queries/listings/products-listing.get';

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
  productsWithPrices.forEach((product) => {
    product.prices.sort((a, b) => {
      return (a.price || 0) - (b.price || 0);
    });
  });

  productsWithPrices.sort((a, b) => {
    return (a.prices[0].price || 0) - (b.prices[0].price || 0);
  });

  return productsWithPrices;
}
