import { type ReactNode } from 'react';

import { type LucideIcon } from 'lucide-react';

import CopyToClipboard from '@/components/etc/copy-to-clipboard';
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
        <TooltipTrigger className='flex w-fit items-center gap-2'>
          <Icon className='h-4 w-4' />
          <CopyToClipboard clipboardText={data ? data.toString() : ''} asChild>
            <span className='text-nowrap text-start text-sm'>{data}</span>
          </CopyToClipboard>
        </TooltipTrigger>
        <TooltipContent>{name}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
