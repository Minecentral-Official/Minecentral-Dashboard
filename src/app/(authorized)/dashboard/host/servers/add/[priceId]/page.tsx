import { HostCheckout } from '@/features/host/components/stripe/checkout';
import { hostCreateStripeSession } from '@/features/host/queries/stripe-session.create';
import validateSession from '@/lib/auth/helpers/validate-session';

type PageProps = {
  params: Promise<{ priceId: string }>;
};

export default async function Page({ params }: PageProps) {
  const priceId = (await params).priceId;
  const sessionData = await hostCreateStripeSession(
    (await validateSession()).user,
    priceId,
  );
  if (!sessionData.clientSecret) throw new Error('Could not create session!');
  return <HostCheckout clientSecret={sessionData.clientSecret} />;
}
