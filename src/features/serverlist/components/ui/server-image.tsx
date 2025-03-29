'use client';

import { useState } from 'react';

import { LoaderPinwheelIcon } from 'lucide-react';
import Image from 'next/image';

import { extractInitials } from '@/lib/utils/extract-initials';

export function ServerImage({
  url,
  title,
  width = 468,
  height = 60,
}: {
  url: string | null;
  title: string;
  width?: number;
  height?: number;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const titlething = extractInitials(title);
  return (
    <>
      {url ?
        <div
          className={`relative max-h-[${height}px] max-w-[${width}px] aspect-[calc(39/5)] overflow-hidden`}
        >
          {isLoading && (
            <div className='absolute left-1/2 top-1/2 max-h-full max-w-full -translate-x-2 -translate-y-2'>
              <LoaderPinwheelIcon className='h-4 w-4 animate-spin' />
            </div>
          )}
          <Image
            width={width}
            height={height}
            alt='Resource Icon'
            src={url || '/placeholder.png'}
            onLoad={() => setIsLoading(false)}
            className='max-w-full rounded-md bg-gray-500'
          />
        </div>
      : <div
          className={`max-h-[${height}px] max-w-[${width}px] aspect-[calc(39/5)] bg-secondary`}
        >
          <p className='flex items-center justify-center p-4 text-center'>
            {titlething}
          </p>
        </div>
      }
    </>
  );
}
