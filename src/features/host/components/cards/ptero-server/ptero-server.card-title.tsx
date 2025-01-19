import { CardTitle } from '@/components/ui/card';
import { pterodactylGetServerById } from '@/features/host/pterodactyl/queries/server-by-server-id.get';

type PteroServerCardTitleProps = {
  serverId: number;
};

export default async function PteroServerCardTitle({
  serverId,
}: PteroServerCardTitleProps) {
  const { name } = await pterodactylGetServerById(serverId);

  return <CardTitle className='p-6 pb-1 pt-6'>{name}</CardTitle>;
}
