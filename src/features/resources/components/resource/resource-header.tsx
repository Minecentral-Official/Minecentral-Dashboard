import Image from 'next/image';

import ResourceStats from '@/features/resources/components/resource/resource-stats';
import { T_DTOResource_WithReleases } from '@/features/resources/types/t-dto-resource.type';

export default function ResourceHeader({
  title,
  subtitle,
  downloads,
  categories,
  iconUrl,
}: Pick<
  T_DTOResource_WithReleases,
  'title' | 'subtitle' | 'iconUrl' | 'categories' | 'downloads'
> & {
  likeCount: number;
}) {
  return (
    <div className='space-4 flex w-full flex-col gap-4 md:flex-row md:items-end'>
      <div className='flex flex-row gap-4'>
        <Image
          src={iconUrl || '/placeholder.png'}
          alt={title}
          width={200}
          height={200}
          className='h-32 w-32 rounded-md bg-secondary object-cover'
        />
        <div className='flex flex-col justify-between'>
          <div className='flex flex-col'>
            <p className='text-xl font-bold'>{title}</p>
            <p className='text-sm'>{subtitle}</p>
          </div>
          <div className='flex flex-row gap-2'>
            <ResourceStats
              {...{ categories, downloads: downloads || 0, likeCount: 0 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
