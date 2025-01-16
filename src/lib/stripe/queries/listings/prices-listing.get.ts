import { stripeAPI } from '@/lib/stripe/api/stripe.api';
import DTOPriceStripe from '@/lib/stripe/dto/price.dto';

import 'server-only';

export default async function getPrices() {
  // get all prices
  const { data: rawPrices } = await stripeAPI.prices.list({
    active: true,
    limit: 100,
  });

  // filter prices
  const filteredPrices = rawPrices.map((rawPrice) => DTOPriceStripe(rawPrice));

  return filteredPrices;
}
