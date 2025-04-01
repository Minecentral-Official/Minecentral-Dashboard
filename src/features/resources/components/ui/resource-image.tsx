'use client';

import { useState } from 'react';

import { LoaderPinwheelIcon } from 'lucide-react';
import Image from 'next/image';

export function ResourceImage({
  url,
  size = 100,
}: {
  url: string | undefined | null;
  size?: number;
}) {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <>
      <div
        className={`relative max-h-[${size}px] max-w-[${size}px] aspect-square overflow-hidden`}
      >
        {isLoading && (
          <div className='absolute left-1/2 top-1/2 max-h-full max-w-full -translate-x-2 -translate-y-2'>
            <LoaderPinwheelIcon className='h-4 w-4 animate-spin' />
          </div>
        )}
        <Image
          width={size}
          height={size}
          alt='Resource Icon'
          src={url || '/missing_texture.webp'}
          onLoad={() => setIsLoading(false)}
          className='aspect-square rounded-md bg-gray-500 object-cover'
        />
      </div>
    </>
  );
}
