import { HostCheckout } from '@/features/host/components/stripe/checkout';
import { hostStripeCreateSession } from '@/features/host/queries/stripe/session.create';
import validateSession from '@/lib/auth/helpers/validate-session';

type PageProps = {
  params: Promise<{ priceId: string }>;
};

export default async function Page({ params }: PageProps) {
  const priceId = (await params).priceId;
  const sessionData = await hostStripeCreateSession(
    (await validateSession()).user,
    priceId,
  );
  if (!sessionData.clientSecret) throw new Error('Could not create session!');
  return <HostCheckout clientSecret={sessionData.clientSecret} />;
}
