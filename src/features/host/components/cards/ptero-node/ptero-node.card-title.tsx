import { CardTitle } from '@/components/ui/card';
import { pterodactylGetNodeById } from '@/features/host/pterodactyl/queries/node-by-id.get';

type PteroNodeCardTitleProps = {
  nodeId: number;
};

export default async function PteroNodeCardTitle({
  nodeId,
}: PteroNodeCardTitleProps) {
  const { name } = await pterodactylGetNodeById(nodeId);
  return <CardTitle className='p-6 pb-1 pt-6'>{name}</CardTitle>;
}
