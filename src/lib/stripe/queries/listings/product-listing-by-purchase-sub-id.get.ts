'use cache';

import { cacheLife } from '@/lib/cache/cache-exports';
import DTOProductStripe from '@/lib/stripe/dto/product.dto';
import getStripeSubscriptionById from '@/lib/stripe/queries/purchases/user-subscription-by-id.get';

export async function getStripeProductByPurchaseSubId(subId: string) {
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

  return DTOProductStripe(product);
}
