import { Donut, Fingerprint, IdCard } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import IconWithDataDisplay from '@/features/host/components/etc/icon-with-data.display';
import { pterodactylGetServerById } from '@/features/host/pterodactyl/queries/server-by-server-id.get';
import hostGetSubscriptionByPterodactylId from '@/features/host/queries/subscription/subscription-by-ptero-id.get';

export async function HostStripeSubscriptionDetailsCard({
  serverId,
}: {
  serverId: number;
}) {
  const { uuid } = await pterodactylGetServerById(serverId);
  const subscriptionTableData =
    await hostGetSubscriptionByPterodactylId(serverId);
  console.log(subscriptionTableData);
  return (
    <Card className='w-full'>
      <CardHeader className='flex flex-row justify-between'>
        <CardTitle>Identifiers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col gap-1'>
          <IconWithDataDisplay data={serverId} icon={IdCard} name='Server ID' />
          <IconWithDataDisplay
            data={subscriptionTableData?.stripeSubscriptionId}
            icon={Donut}
            name='Subscription ID'
          />
          <IconWithDataDisplay
            data={uuid}
            icon={Fingerprint}
            name='Server UUID'
          />
        </div>
      </CardContent>
    </Card>
  );
}
