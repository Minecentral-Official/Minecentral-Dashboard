'use client';

import { useState } from 'react';

import { LoaderCircleIcon, ThumbsUpIcon } from 'lucide-react';

import ButtonTooltip from '@/components/ui/tooltip-button';
import resourceToggleLikeAction from '@/features/resources/actions/toggle-like-resource.action';

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
      className={
        followLoading ? 'animate-spin'
        : liked ?
          'text-green-300 hover:text-red-400'
        : 'hover:text-green-300'
      }
      Icon={followLoading ? LoaderCircleIcon : ThumbsUpIcon}
      onClick={handleClick}
    />
  );
}
