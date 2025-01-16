import Link from 'next/link';

import { Button } from '@/components/ui/button';
import hostGetServerIdBySubscriptionId from '@/features/host/queries/server-id-by-subscription-id.get';
import { hostStripeGetSessionData } from '@/features/host/queries/stripe/session-data.get';
import { getStripeProductByPurchaseSubId } from '@/lib/stripe/queries/listings/product-listing-by-purchase-sub-id.get';

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

  const { name } = await getStripeProductByPurchaseSubId(subscription_id);
  const id = await hostGetServerIdBySubscriptionId(subscription_id);
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
          <Link href={`/dashboard/host/servers/${id}`}>Get Started!</Link>
        </Button>
      </div>
    </div>
  );
}
