import Image from 'next/image';

import { T_DTOResource } from '@/features/resources/types/t-dto-resource.type';

export default function ResourceHeader({
  title,
  subtitle,
  // downloads,
  iconUrl,
}: Pick<T_DTOResource, 'title' | 'subtitle' | 'iconUrl' | 'categories'> & {
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
            {/* <ResourceStats
              {...{ categories, downloads: 10543677, likeCount }}
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
