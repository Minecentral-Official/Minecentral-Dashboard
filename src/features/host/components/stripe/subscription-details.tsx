import { Donut, Fingerprint, IdCard } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import IconWithDataDisplay from '@/features/host/components/etc/icon-with-data.display';
import { MCProduct_Host } from '@/features/host/dto/host-product.dto';
import { HostSubscription } from '@/lib/db/schema';

export async function HostStripeSubscriptionDetails({
  stripeProduct,
  hostSubscription,
}: {
  stripeProduct: MCProduct_Host;
  hostSubscription: HostSubscription;
}) {
  console.log(stripeProduct);
  return (
    <Card className='w-full'>
      <CardHeader className='flex flex-row justify-between'>
        <CardTitle>Identifiers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col gap-1'>
          <IconWithDataDisplay
            data={hostSubscription.pterodactylServerId}
            icon={IdCard}
            name='Server ID'
          />
          <IconWithDataDisplay
            data={hostSubscription.stripeSubscriptionId}
            icon={Donut}
            name='Subscription ID'
          />
          <IconWithDataDisplay
            data={hostSubscription.pterodactylServerUuid}
            icon={Fingerprint}
            name='Server UUID'
          />
        </div>
      </CardContent>
    </Card>
  );
}
