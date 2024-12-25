import { stripeAPI } from '@/stripe/lib/stripe.api';

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
