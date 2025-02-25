'use client';

import { HeartIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import resourceToggleLikeAction from '@/features/resources/actions/toggle-like-resource.action';
import DownloadButton from '@/features/resources/components/ui/download-button';
import { TResourcePlugin } from '@/features/resources/types/t-dto-resource-with-releases.type';

export default function ResourceButtonHot({
  release,
  liked,
  id,
}: Pick<TResourcePlugin, 'title' | 'release' | 'id'> & {
  liked: boolean;
}) {
  const handleClick = async () => {
    await resourceToggleLikeAction(id);
  };

  return (
    <div className='flex flex-row gap-2'>
      <DownloadButton
        downloadUrl={`/api/download/plugin?rId=${release?.downloadId}`}
      />

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className={`h-10 w-10 rounded-full ${liked ? 'bg-red-600 hover:bg-red-400' : ''}`}
              onClick={handleClick}
            >
              <HeartIcon className='h-5 w-5' />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{liked ? 'Unfollow' : 'Follow'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
