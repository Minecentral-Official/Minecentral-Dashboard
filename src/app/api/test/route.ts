import hostPricingTypesafe from '@/features/stripe/pricing/host/host-pricing-typesafe';

export async function GET() {
  return Response.json(await hostPricingTypesafe());
}
