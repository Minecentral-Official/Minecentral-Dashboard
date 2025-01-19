import DTOPriceStripe from '@/lib/stripe/dto/price.dto';
import DTOProductStripe from '@/lib/stripe/dto/product.dto';

export default function DTOProductWithPricesStripe(
  product: ReturnType<typeof DTOProductStripe>,
  prices: ReturnType<typeof DTOPriceStripe>[],
) {
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
}
