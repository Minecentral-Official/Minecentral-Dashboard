import PterodactylServerCard, {
  PteroServerCardDivider,
  PteroServerCardFooter,
  PteroServerCardHeader,
  PteroServerCardTitle,
} from '@/features/host/components/cards/pterodactyl-server.card';
import { HostStripeSubscriptionLinks } from '@/features/host/components/cards/subscription-links.card';
import { HostStripeSubscriptionDetails } from '@/features/host/components/stripe/subscription-details';
import { pterodactylGetFullServerData } from '@/features/host/pterodactyl/queries/server-full-data.get';

type PageProps = {
  params: Promise<{ serverId: number }>;
};

export default async function Page({ params }: PageProps) {
  const { serverId } = await params;
  const { server, allocation, subscription } =
    await pterodactylGetFullServerData({ pterodactylServerId: serverId });

  const pteroServerCardProps = {
    name: server.name,
    backups: server.feature_limits.backups,
    cpuThreads: server.limits.cpu,
    databases: server.feature_limits.databases,
    storage: server.limits.disk,
    ram: server.limits.memory,
    splits: server.feature_limits.splits,
    ip: allocation.ip,
    port: allocation.port,
    id: server.id,
    uuid: server.uuid,
    plan: subscription.stripe.name,
  };

  const hostStripeSubscriptionDetailsProps = {
    hostSubscription: subscription.host,
    stripeProduct: subscription.stripe,
  };

  return (
    <div className='flex flex-col gap-6'>
      <PterodactylServerCard {...pteroServerCardProps}>
        <PteroServerCardHeader>
          <PteroServerCardTitle />
        </PteroServerCardHeader>
        <PteroServerCardDivider />
        {/* TODO: removing this for now, creating new card for this */}
        {/* <PteroServerCardFooter /> */}
      </PterodactylServerCard>

      <div className='flex flex-wrap gap-6'>
        <div className='flex-1'>
          <HostStripeSubscriptionDetails
            {...hostStripeSubscriptionDetailsProps}
          />
        </div>
        <div className='w-full flex-none md:w-auto'>
          <HostStripeSubscriptionLinks
            panelLink={`https://panel.ronanhost.com/server/${hostStripeSubscriptionDetailsProps.hostSubscription.pterodactylServerUuid}`}
          />
        </div>
      </div>
      <PterodactylServerCard {...pteroServerCardProps}>
        <div className='pt-6'></div>
        <PteroServerCardFooter />
      </PterodactylServerCard>
    </div>
  );
}
