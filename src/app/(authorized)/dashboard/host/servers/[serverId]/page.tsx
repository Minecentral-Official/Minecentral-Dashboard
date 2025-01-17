import { Separator } from '@/components/ui/separator';
import PterodactylServerCard from '@/features/host/components/cards/pterodactyl-server.card';
import { HostStripeSubscriptionDatails } from '@/features/host/components/stripe/subscription-details';
import { pterodactylGetFullServerData } from '@/features/host/pterodactyl/queries/server-full.get';

type PageProps = {
  params: Promise<{ serverId: number }>;
};

export default async function Page({ params }: PageProps) {
  const { serverId } = await params;
  const {
    server: {
      limits: { cpu, memory, disk },
      id,
      name,
      feature_limits: { backups, databases, splits },
      uuid,
    },
    allocation: { ip, port },
    subscription: { stripe: stripeProduct, host: hostSubscription },
  } = await pterodactylGetFullServerData({ pterodactylServerId: serverId });

  return (
    <>
      <div className='flex w-full flex-col gap-2 py-2'>
        <h1 className='text-4xl font-bold'>Server Datails</h1>
        <Separator />
        <PterodactylServerCard
          key={id}
          name={name}
          backups={backups}
          cpuThreads={cpu}
          databases={databases}
          storage={disk}
          ram={memory}
          splits={splits}
          ip={ip}
          port={port}
          id={id}
          uuid={uuid}
          plan={stripeProduct.name}
        />
      </div>
      <div className='flex w-full flex-col gap-2 py-2'>
        <h1 className='text-4xl font-bold'>Subscription</h1>
        <Separator />
        <div className='grid gap-2'>
          <HostStripeSubscriptionDatails
            hostSubscription={hostSubscription}
            stripeProduct={stripeProduct}
          />
          {/* <PurchaseManage purchase={purchase} /> */}
        </div>
      </div>
    </>
  );
}
