'use cache';

import { cacheLife } from '@/lib/cache/cache-exports';
import getProductsWithPrices from '@/lib/stripe/queries/listings/product-listing-with-prices.get';
import getStripeSubscriptionById from '@/lib/stripe/queries/purchases/user-subscription-by-id.get';

export async function getStripeProductListingByPurchaseSubId(subId: string) {
  cacheLife('days');
  const subscription = await getStripeSubscriptionById(subId);

  const product = subscription.items.data[0].plan.product;

  if (!product) {
    throw new Error('No product found');
  }

  if (typeof product === 'string') {
    throw new Error("This has been expanded and shouldn't be a string");
  }

  if (product?.deleted === true) {
    throw new Error('this product has been deleted');
  }

  const productId = product.id;

  //Grab DTO product from cache
  const productsWithPrices = await getProductsWithPrices();

  const productFound = productsWithPrices.find(
    (product) => product.id === productId,
  );

  if (!productFound) throw new Error('Could not find product somehow?');

  return productFound;
}
