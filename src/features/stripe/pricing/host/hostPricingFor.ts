import { stripeAPI } from '../../lib/stripe.api';

export default async function (priceID: string) {
  try {
    const product = await stripeAPI.products.retrieve(priceID);
    const prices = await stripeAPI.prices.list({
      product: product.id,
      active: true,
    });
    return Response.json({ data: product, prices: prices.data });
  } catch (err) {
    console.log(err);
    return Response.error();
  }
}
