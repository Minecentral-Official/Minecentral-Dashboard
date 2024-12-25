import priceDTO from '@/stripe/dto/price.dto';
import { stripeAPI } from '@/stripe/lib/stripe.api';

import 'server-only';

export default async function getPrices() {
  // get all prices
  const { data: rawPrices } = await stripeAPI.prices.list({
    active: true,
    limit: 100,
  });

  // filter prices
  const filteredPrices = rawPrices.map((rawPrice) => priceDTO(rawPrice));

  return filteredPrices;
}
