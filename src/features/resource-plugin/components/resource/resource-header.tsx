import { DownloadIcon } from 'lucide-react';
import Image from 'next/image';

import { TResourcePlugin } from '@/features/resource-plugin/types/plugin-all-data.type';

export default function ResourceHeader({
  title,
  subtitle,
  downloads,
  iconUrl,
}: Pick<TResourcePlugin, 'title' | 'subtitle' | 'downloads' | 'iconUrl'>) {
  return (
    <div className='space-4 flex flex-col items-end gap-4 md:flex-row'>
      <div className='flex w-fit flex-row gap-4'>
        <Image
          src={iconUrl || '/placeholder.png'}
          alt={title}
          width={300}
          height={200}
          className='h-32 w-32 rounded-md object-cover'
        />
        <div className='flex flex-col justify-between'>
          <div>
            <p className='text-xl font-bold'>{title}</p>
            <p className='text-sm'>{subtitle}</p>
          </div>
          <div className='flex flex-row gap-2'>
            <DownloadIcon className='h-5 w-5' />
            <span className='text-bold'>{downloads}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
