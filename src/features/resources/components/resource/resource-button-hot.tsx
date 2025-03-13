import { ClipboardCopyIcon, FlagIcon, MoreVertical } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import ResourceButtonSettings from '@/features/resources/components/resource/resource-button-settings';
import ResourceToggleLikeButton from '@/features/resources/components/resource/resource-toggle-like-button';
import DownloadButton from '@/features/resources/components/ui/download-button';
import { T_DTOResource_WithReleases } from '@/features/resources/types/t-dto-resource.type';

export default function ResourceButtonHot({
  release,
  liked,
  id,
  slug,
}: Pick<T_DTOResource_WithReleases, 'title' | 'release' | 'id' | 'slug'> & {
  liked: boolean;
}) {
  return (
    <div className='flex flex-row-reverse flex-wrap items-end gap-2 md:flex-col'>
      <DownloadButton downloadUrl={`/api/download?rId=${release?.id}`} />
      <div className='flex flex-row gap-2'>
        <ResourceToggleLikeButton liked={liked} resourceId={id} />

        <ResourceButtonSettings slug={slug} />

        <TooltipProvider>
          <Popover>
            <Tooltip>
              <PopoverTrigger asChild>
                <TooltipTrigger asChild>
                  <Button
                    className={`h-10 w-10 rounded-full`}
                    variant={'ghost'}
                  >
                    <MoreVertical className='h-5 w-5' />
                  </Button>
                </TooltipTrigger>
              </PopoverTrigger>
              <TooltipContent>
                <p>More options</p>
              </TooltipContent>
            </Tooltip>
            <PopoverContent className='w-fit p-2'>
              <div className='grid gap-1'>
                <Button className='m-0 p-2' variant={'ghost'}>
                  <ClipboardCopyIcon /> Copy Id
                </Button>
                <Separator />
                <Button className='m-0 p-2 text-red-500' variant={'ghost'}>
                  <FlagIcon /> Report
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </TooltipProvider>
      </div>
    </div>
  );
}
