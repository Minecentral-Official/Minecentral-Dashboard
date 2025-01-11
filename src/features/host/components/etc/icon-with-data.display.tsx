import { type ReactNode } from 'react';

import { type LucideIcon } from 'lucide-react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type IconWithDataDisplayProps = {
  data: ReactNode;
  icon: LucideIcon;
  name: string;
};

export default function IconWithDataDisplay({
  icon,
  data,
  name,
}: IconWithDataDisplayProps) {
  const Icon = icon;
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className='flex gap-2'>
            <Icon />
            {data}
          </div>
        </TooltipTrigger>
        <TooltipContent>{name}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
