import hostPricingTypesafe from '@/features/stripe/pricing/host/host-pricing-typesafe';

export default async function Home() {
  const asdf = await hostPricingTypesafe();
  console.log(asdf);
  return <>Default Page</>;
}
