import { stripeAPI } from '@/lib/stripe/api/stripe.api';

// Probably relocate this file to /features/host/queries
// Still waiting on you to finish this up cuz idk what this is supposed to be fore

export default async function hostPricingFor(productID: string) {
  try {
    const product = await stripeAPI.products.retrieve(productID);
    const prices = await stripeAPI.prices.list({
      product: product.id,
      active: true,
    });
    return { data: product, prices: prices.data };
  } catch (err) {
    console.log(err);
    throw new Error();
  }
}
