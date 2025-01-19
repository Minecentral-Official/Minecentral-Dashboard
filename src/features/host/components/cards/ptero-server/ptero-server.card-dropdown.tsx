import ManageServerDropdown from '@/features/host/components/dropdown/manage-server.dropdown';
import { pterodactylGetServerById } from '@/features/host/pterodactyl/queries/server-by-server-id.get';

type PteroServerCardDropdownProps = {
  serverId: number;
};

export default async function PteroServerCardDropdown({
  serverId,
}: PteroServerCardDropdownProps) {
  const { id, uuid } = await pterodactylGetServerById(serverId);
  return (
    <div className='m-4 mb-0'>
      <ManageServerDropdown serverId={id} serverUuid={uuid} />
    </div>
  );
}
