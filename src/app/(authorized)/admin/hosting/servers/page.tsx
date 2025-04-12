import PteroServerCard from '@/features/host/components/cards/ptero-server/ptero-server.card';
import PteroServerCardFooter from '@/features/host/components/cards/ptero-server/ptero-server.card-footer';
import PteroServerCardHeader from '@/features/host/components/cards/ptero-server/ptero-server.card-header';
import PteroServerCardDivider from '@/features/host/components/cards/ptero-server/ptero-server.card-separator';
import PteroServerCardTitle from '@/features/host/components/cards/ptero-server/ptero-server.card-title';
import { hostADMINGetAllServers } from '@/features/host/queries/admin-list-servers.get';

export default async function AdminHostPage() {
  const servers = await hostADMINGetAllServers();
  if (!servers) return <>Error</>;
  return (
    <div className='grid grid-cols-3 gap-2'>
      {servers.map((server) => (
        <PteroServerCard key={server.id}>
          <PteroServerCardHeader>
            <PteroServerCardTitle serverId={server.id} />
          </PteroServerCardHeader>
          <PteroServerCardDivider serverId={server.id} />
          <PteroServerCardFooter serverId={server.id} />
        </PteroServerCard>
      ))}
    </div>
  );
}
