import { DonutIcon, ServerIcon, ShieldIcon } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HostStripeSubscriptionActions } from '@/features/host/components/stripe/subscription-actions';
import { MCProduct_Host } from '@/features/host/dto/host-product.dto';
import { HostSubscription } from '@/lib/db/schema';

export function HostStripeSubscriptionDatails({
  stripeProduct,
  hostSubscription,
}: {
  stripeProduct: MCProduct_Host;
  hostSubscription: HostSubscription;
}) {
  // const openCustomerPortal = async () => {
  //   try {
  //     const res = await axios.post("/api/stripe/session/create-portal-session");
  //     window.open(res.data.url, "_blank");
  //   } catch (err) {
  //     toast.error("Unable to open Billing Portal");
  //   }
  // };

  return (
    <Card className='w-full'>
      <CardHeader className='flex flex-row justify-between'>
        <div className='flex flex-col'>
          <CardTitle className='text-2xl'>
            Plan - {stripeProduct.name}
          </CardTitle>
          {/* <CardDescription>Manage your server</CardDescription> */}
        </div>

        <HostStripeSubscriptionActions hostSubscription={hostSubscription} />
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-2'>
            {/* <h3 className='text-lg font-semibold'>Details</h3> */}
            <p className='flex items-center'>
              <DonutIcon className='mr-2 h-4 w-4' /> ID:{' '}
              {hostSubscription.stripeSubscriptionId}
            </p>
            <p className='flex items-center'>
              <ServerIcon className='mr-2 h-4 w-4' /> Server ID:{' '}
              {hostSubscription.pterodactylServerId}
            </p>
            <p className='flex items-center'>
              <ShieldIcon className='mr-2 h-4 w-4' /> Server UUID:{' '}
              {hostSubscription.pterodactylServerUuid}
            </p>
          </div>
          {/* <div className='space-y-2'>
            <h3 className='text-lg font-semibold'>Subscription Info</h3>
            <p>Amount: ${purchase.amount / 100}</p>
            <p>
              Expires:{' '}
              {new Date(purchase.expriesAt * 1000).toLocaleDateString()}
            </p>
            <p>
              Status:{' '}
              {purchase.active ?
                <span className='text-green-400'>Active</span>
              : <span className='text-red-500'>Inactive</span>}
            </p>
          </div> */}
        </div>
      </CardContent>
    </Card>
  );
}
