'use client';

import { useState } from 'react';

import { LoaderCircleIcon, ThumbsUpIcon } from 'lucide-react';

import ButtonTooltip from '@/components/ui/tooltip-button';
import resourceToggleLikeAction from '@/features/resources/actions/toggle-like-resource.action';
import { cn } from '@/lib/utils';

export default function ResourceToggleLikeButton({
  liked,
  resourceId,
}: {
  liked: boolean;
  resourceId: string;
}) {
  const [followLoading, setFollowLoading] = useState(false);

  const handleClick = async () => {
    setFollowLoading(true);
    await resourceToggleLikeAction(resourceId);
    setFollowLoading(false);
  };

  return (
    <ButtonTooltip
      tooltip={liked ? 'Unfollow' : 'Follow'}
      variant={liked ? 'secondary' : 'ghost'}
      className={
        cn(followLoading ? 'animate-spin' : undefined, liked ? 'text-primary hover:text-destructive' : undefined)
      }
      Icon={followLoading ? LoaderCircleIcon : ThumbsUpIcon}
      onClick={handleClick}
    />
  );
}
