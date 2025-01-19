import { Plus } from 'lucide-react';

import AddServerButton from '@/features/host/components/buttons/add-server.button';
import NextPaymentCard from '@/features/host/components/cards/next-payment.card';
import PteroServerCard from '@/features/host/components/cards/ptero-server/ptero-server.card';
import PteroServerCardDropdown from '@/features/host/components/cards/ptero-server/ptero-server.card-dropdown';
import PteroServerCardFooter from '@/features/host/components/cards/ptero-server/ptero-server.card-footer';
import PteroServerCardHeader from '@/features/host/components/cards/ptero-server/ptero-server.card-header';
import PteroServerCardDivider from '@/features/host/components/cards/ptero-server/ptero-server.card-separator';
import PteroServerCardTitle from '@/features/host/components/cards/ptero-server/ptero-server.card-title';
import ServerCountCard from '@/features/host/components/cards/server-count.card';
import { pterodactylGetServersByUserId } from '@/features/host/pterodactyl/queries/servers-by-user-id.get';
import validateSession from '@/lib/auth/helpers/validate-session';

export default async function HostServersPage() {
  const { user } = await validateSession();
  const pteroServers = await pterodactylGetServersByUserId(user.id);

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
      {pteroServers.map(({ id }) => (
        <PteroServerCard key={id}>
          <PteroServerCardHeader>
            <PteroServerCardTitle serverId={id} />
            <PteroServerCardDropdown serverId={id} />
          </PteroServerCardHeader>
          <PteroServerCardDivider serverId={id} />
          <PteroServerCardFooter serverId={id} />
        </PteroServerCard>
      ))}
    </div>
  );
}
