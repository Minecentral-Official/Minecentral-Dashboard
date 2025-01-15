import { PanelServer } from 'pterodactyl.ts';

import { hostADMINGetAllServers } from '@/features/host/queries/admin-list-servers.get';

export default async function AdminHostPage() {
  const servers = await hostADMINGetAllServers();
  return (
    <div className='flex flex-col gap-6'>
      {servers.map((server) => (
        <Server server={server} />
      ))}
    </div>
  );
}

function Server({
  server: {
    id,
    limits: { cpu, memory },
  },
}: {
  server: PanelServer;
}) {
  return (
    <div>
      {id} {cpu} {memory}
    </div>
  );
}
