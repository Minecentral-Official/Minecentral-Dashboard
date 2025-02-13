import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { hostStripeGetSessionData } from '@/features/host/queries/stripe/session-data.get';
import hostGetSubscriptionByStripeSubscriptionId from '@/features/host/queries/subscription/subscription-by-stripe-sub-id.get';
import { stripeGetProductWithPricesBySubscriptionId } from '@/lib/stripe/queries/listings/product-with-price-by-sub-id.get';

//HUGO: Make this page look nicer, probably cant see this page without making a fake payment
//TRY using this url/session id
//"http://localhost:3000/dashboard/host/servers/add/success?session=cs_test_b1vr8uUMPe6rPUCoZiwY60y5hZqjAatWbOqd8Mk3XSoUZIwuvXxjejtokd"
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ session: string }>;
}) {
  const { session } = await searchParams;
  const {
    // status,
    // customer_id,
    // payment_status,
    // payment_total,
    subscription_id,
  } = await hostStripeGetSessionData(session);

  const { name } =
    await stripeGetProductWithPricesBySubscriptionId(subscription_id);
  const subscriptionData =
    await hostGetSubscriptionByStripeSubscriptionId(subscription_id);

  if (!subscriptionData) {
    notFound();
  }

  const { pterodactylServerId: id } = subscriptionData;

  //I don't know the difference between a session status and payment status, just do something with this data xD
  return (
    <div className='flex h-full w-full items-center justify-center'>
      <div className='flex flex-col items-center gap-6'>
        <div className='text-center text-5xl font-bold'>
          🎉 Congratulations, Adventurer!
        </div>
        <div className='flex flex-col items-center'>
          <p className='text-center'>
            Thank you for choosing Minecentral Hosting!
          </p>
          <p className='text-center'>
            Your {name} server is now active and ready to help you build your
            dream worlds.
          </p>
        </div>
        <Button asChild>
          <Link href={`/dashboard/hosting/servers/${id}`}>Get Started!</Link>
        </Button>
      </div>
    </div>
  );
}
