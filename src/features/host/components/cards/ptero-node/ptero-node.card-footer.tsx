import { Box, MemoryStick } from 'lucide-react';

import { CardFooter } from '@/components/ui/card';
import IconWithDataDisplay from '@/features/host/components/etc/icon-with-data.display';
import { pterodactylGetNodeById } from '@/features/host/pterodactyl/queries/node-by-id.get';

type PteroNodeCardFooterProps = {
  nodeId: number;
};

export default async function PteroNodeCardFooter({
  nodeId,
}: PteroNodeCardFooterProps) {
  const { memory, disk, allocated_resources } =
    await pterodactylGetNodeById(nodeId);

  return (
    <CardFooter className='flex items-center justify-between'>
      <div className='flex gap-6'>
        <IconWithDataDisplay
          data={`${Math.round(allocated_resources.memory / 1024)} / ${Math.round(memory / 1024)}`}
          icon={MemoryStick}
          name='RAM'
        />
        <IconWithDataDisplay
          data={`${Math.round(allocated_resources.disk / 1024)} / ${Math.round(disk / 1024)}`}
          icon={Box}
          name='Storage'
        />
      </div>
    </CardFooter>
  );
}
