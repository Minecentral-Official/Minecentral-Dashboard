import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function ButtonTooltip({
  tooltip,
  Icon,
  onClick,
  className,
}: {
  tooltip: string;
  Icon: React.ElementType;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className={`relative h-10 w-10 items-center justify-center rounded-full ${className}`}
            onClick={onClick}
          >
            <Icon className='absolute inset-0 m-auto h-5 w-5' />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
