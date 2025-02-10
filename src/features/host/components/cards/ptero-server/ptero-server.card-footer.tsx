import {
  Archive,
  Box,
  Database,
  MemoryStick,
  SquareSplitVertical,
  Volleyball,
} from 'lucide-react';

import { CardFooter } from '@/components/ui/card';
import IconWithDataDisplay from '@/features/host/components/etc/icon-with-data.display';
import { pterodactylGetServerById } from '@/features/host/pterodactyl/queries/server-by-server-id.get';

type PteroServerCardFooterProps = {
  serverId: number;
};

export default async function PteroServerCardFooter({
  serverId,
}: PteroServerCardFooterProps) {
  const { limits, feature_limits } = await pterodactylGetServerById(serverId);

  const { cpu, disk, memory } = limits;
  const { backups, splits, databases } = feature_limits;

  return (
    <CardFooter className='flex items-center justify-between'>
      <div className='flex gap-6'>
        <IconWithDataDisplay
          data={memory / 1024}
          icon={MemoryStick}
          name='RAM'
        />
        <IconWithDataDisplay
          data={cpu / 100}
          icon={Volleyball}
          name='CPU Threads'
        />
        <IconWithDataDisplay data={disk / 1024} icon={Box} name='Storage' />
        <IconWithDataDisplay
          data={databases}
          icon={Database}
          name='Databases'
        />
        <IconWithDataDisplay data={backups} icon={Archive} name='Backups' />
        <IconWithDataDisplay
          data={splits}
          icon={SquareSplitVertical}
          name='Splits'
        />
      </div>
    </CardFooter>
  );
}
