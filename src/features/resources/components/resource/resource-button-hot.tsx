'use client';

import { useState } from 'react';

import {
  ClipboardCopyIcon,
  FlagIcon,
  HeartIcon,
  LoaderPinwheelIcon,
  MoreVertical,
} from 'lucide-react';

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
import ButtonTooltip from '@/components/ui/tooltip-button';
import resourceToggleLikeAction from '@/features/resources/actions/toggle-like-resource.action';
import ResourceButtonSettings from '@/features/resources/components/resource/resource-button-settings';
import DownloadButton from '@/features/resources/components/ui/download-button';
import { T_DTOResource_WithReleases } from '@/features/resources/types/t-dto-resource-with-releases.type';

export default function ResourceButtonHot({
  release,
  liked,
  id,
}: Pick<T_DTOResource_WithReleases, 'title' | 'release' | 'id'> & {
  liked: boolean;
}) {
  const [followLoading, setFollowLoading] = useState(false);

  const handleClick = async () => {
    setFollowLoading(true);
    await resourceToggleLikeAction(id);
    setFollowLoading(false);
  };

  return (
    <div className='flex flex-row-reverse flex-wrap items-end gap-2 md:flex-col'>
      <DownloadButton
        downloadUrl={`/api/download/plugin?rId=${release?.downloadId}`}
      />
      <div className='flex flex-row gap-2'>
        <ButtonTooltip
          tooltip={liked ? 'Unfollow' : 'Follow'}
          className={
            followLoading ? 'animate-spin'
            : liked ?
              'bg-red-600 hover:bg-red-400'
            : ''
          }
          Icon={followLoading ? LoaderPinwheelIcon : HeartIcon}
          onClick={handleClick}
        />

        <ResourceButtonSettings id={id} />

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
