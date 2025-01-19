import DTOProductWithPricesStripe from '@/lib/stripe/dto/product-with-prices.dto';

export default function stripeSortProductsByPrices(
  productsWithPrices: ReturnType<typeof DTOProductWithPricesStripe>[],
) {
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
