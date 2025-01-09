import { HostCheckout } from '@/features/host/components/stripe/checkout';
import validateSession from '@/lib/auth/helpers/validate-session';
import { stripeSessionCreate } from '@/lib/stripe/pricing/session.create';

type PageProps = {
  params: Promise<{ priceId: string }>;
};

export default async function Page({ params }: PageProps) {
  const priceId = (await params).priceId;
  const sessionData = await stripeSessionCreate(
    (await validateSession()).user,
    priceId,
  );
  if (!sessionData.clientSecret) throw new Error('Could not create session!');
  return <HostCheckout clientSecret={sessionData.clientSecret} />;
}
