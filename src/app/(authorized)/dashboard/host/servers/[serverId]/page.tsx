import PteroServerCard from '@/features/host/components/cards/ptero-server/ptero-server.card';
import PteroServerCardFooter from '@/features/host/components/cards/ptero-server/ptero-server.card-footer';
import PteroServerCardHeader from '@/features/host/components/cards/ptero-server/ptero-server.card-header';
import PteroServerCardDivider from '@/features/host/components/cards/ptero-server/ptero-server.card-separator';
import PteroServerCardTitle from '@/features/host/components/cards/ptero-server/ptero-server.card-title';
import { HostStripeSubscriptionLinks } from '@/features/host/components/cards/subscription-links.card';
import { HostStripeSubscriptionDetailsCard } from '@/features/host/components/stripe/subscription-details';
import { pterodactylGetServerById } from '@/features/host/pterodactyl/queries/server-by-server-id.get';

type PageProps = {
  params: Promise<{ serverId: number }>;
};

export default async function Page({ params }: PageProps) {
  const { serverId } = await params;

  const { uuid } = await pterodactylGetServerById(serverId);
  return (
    <div className='flex flex-col gap-6'>
      <PteroServerCard>
        <PteroServerCardHeader>
          <PteroServerCardTitle serverId={serverId} />
        </PteroServerCardHeader>
        <PteroServerCardDivider serverId={serverId} />
      </PteroServerCard>

      <div className='flex flex-wrap gap-6'>
        <div className='flex-1'>
          <HostStripeSubscriptionDetailsCard serverId={serverId} />
        </div>
        <div className='w-full flex-none md:w-auto'>
          <HostStripeSubscriptionLinks
            panelLink={`https://panel.ronanhost.com/server/${uuid}`}
          />
        </div>
      </div>
      <PteroServerCard>
        <div className='pt-6'></div>
        <PteroServerCardFooter serverId={serverId} />
      </PteroServerCard>
    </div>
  );
}
