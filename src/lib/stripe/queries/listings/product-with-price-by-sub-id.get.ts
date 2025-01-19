'use cache';

import { cacheLife } from '@/lib/cache/cache-exports';
import DTOProductWithPricesStripe from '@/lib/stripe/dto/product-with-prices.dto';
import stripeGetSubscriptionById from '@/lib/stripe/queries/purchases/subscription-by-id.get';

export async function stripeGetProductWithPricesBySubscriptionId(
  subId: string,
) {
  cacheLife('days');
  const subscription = await stripeGetSubscriptionById(subId);
  const product = subscription.product[0].product;
  const price = subscription.product[0].price;
  const productWithPrice = DTOProductWithPricesStripe(product, [price]);
  // const productId = product.id;

  //Grab DTO product from cache
  // const productsWithPrices = await stripeGetProductsWithPrices();

  // const productFound = productsWithPrices.find(
  //   (product) => product.id === productId,
  // );

  // if (!productFound) throw new Error('Could not find product somehow?');

  return productWithPrice;
}
