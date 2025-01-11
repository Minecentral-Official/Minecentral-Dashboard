import { Plus } from 'lucide-react';

import AddServerButton from '@/features/host/components/buttons/add-server.button';
import NextPaymentCard from '@/features/host/components/cards/next-payment.card';
import PterodactylServerCard from '@/features/host/components/cards/pterodactyl-server.card';
import ServerCountCard from '@/features/host/components/cards/server-count.card';
import { hostGetUserPterdactylServers } from '@/features/host/queries/user-pterodactyl-servers.get';

export default async function HostServersPage() {
  const serverData = await hostGetUserPterdactylServers();
  console.log(serverData);
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
      {serverData.map(
        ({
          stripeProductData: {
            name: stripeName,
            metadata: { backups, cpu, databases, disk, ram, splits },
          },
          pterodactylServerData: { name: pteroName, id: pteroId },
        }) => (
          <PterodactylServerCard
            key={pteroId}
            name={pteroName}
            plan={stripeName}
            backups={backups}
            cpuThreads={cpu}
            databases={databases}
            storage={disk}
            ram={ram}
            splits={splits}
          />
        ),
      )}
    </div>
  );
}
