import { Plus } from 'lucide-react';

import AddServerButton from '@/features/host/components/buttons/add-server.button';
import NextPaymentCard from '@/features/host/components/cards/next-payment.card';
import PteroServerCard, {
  PteroServerCardDivider,
  PteroServerCardDropdown,
  PteroServerCardFooter,
  PteroServerCardHeader,
  PteroServerCardTitle,
} from '@/features/host/components/cards/pterodactyl-server.card';
import ServerCountCard from '@/features/host/components/cards/server-count.card';
import { userGetPterodactylServers } from '@/features/host/pterodactyl/queries/get-servers.user';

export default async function HostServersPage() {
  const serverData = await userGetPterodactylServers();
  // console.log(serverData);
  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-wrap gap-6'>
        <ServerCountCard cardProps={{ className: 'flex-1' }} />
        <NextPaymentCard cardProps={{ className: 'flex-1' }} />
        <AddServerButton
          buttonProps={{ className: 'h-auto flex-1 rounded-xl' }}
        >
          <Plus className='scale-150' />
        </AddServerButton>
      </div>
      {serverData.map(({ server, allocation, subscription }) => {
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
        return (
          <PteroServerCard key={server.id} {...pteroServerCardProps}>
            <PteroServerCardHeader>
              <PteroServerCardTitle />
              <PteroServerCardDropdown />
            </PteroServerCardHeader>
            <PteroServerCardDivider />
            <PteroServerCardFooter />
          </PteroServerCard>
        );
      })}
    </div>
  );
}
