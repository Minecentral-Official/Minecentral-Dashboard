import { DownloadIcon, HeartIcon } from 'lucide-react';

import { T_DTOResource_WithReleases } from '@/features/resources/types/t-dto-resource.type';
import compactNumber from '@/lib/utils/compact-number';

export default function ResourceStats({
  downloads,
  likes,
}: Pick<T_DTOResource_WithReleases, 'downloads' | 'likes'>) {
  return (
    <div className='flex flex-row gap-2'>
      <div className='flex flex-row items-center gap-2'>
        <DownloadIcon className='h-5 w-5' />
        <span className='text-bold'>{compactNumber(downloads)}</span>
      </div>

      <div className='flex flex-row items-center gap-2'>
        <HeartIcon className='h-5 w-5' />
        <span className='text-bold'>{compactNumber(likes)}</span>
      </div>
    </div>
  );
}
