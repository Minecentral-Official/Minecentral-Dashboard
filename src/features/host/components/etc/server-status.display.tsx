import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import type { ServerStatus } from 'pterodactyl.ts';

const statusColorLookupTable = {
  online: 'bg-green-500',
  offline: 'bg-slate-500',
  starting: 'bg-amber-500',
  stopping: 'bg-red-500',
  running: 'bg-green-500',
} satisfies Record<ServerStatus, string> & {
  running: string;
};

type ServerStatusDisplayProps = {
  status: ServerStatus;
};

export default function ServerStatusDisplay({
  status,
}: ServerStatusDisplayProps) {
  const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              'aspect-square h-4 w-4 rounded-full',
              statusColorLookupTable[status],
            )}
          />
        </TooltipTrigger>
        <TooltipContent>{formattedStatus}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
