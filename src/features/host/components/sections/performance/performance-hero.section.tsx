import Image from 'next/image';

import { Badge } from '@/components/ui/badge';

export default function PerformanceHeroSection() {
  return (
    <div className='w-full py-20 lg:py-40'>
      <div className='container mx-auto'>
        <div className='flex flex-col gap-10 lg:flex-row lg:items-center'>
          <div className='flex flex-1 flex-col gap-4'>
            <div>
              <Badge>Powerful and Reliable</Badge>
            </div>
            <div className='flex flex-col gap-2'>
              <h2 className='font-regular text-left text-xl tracking-tighter md:text-3xl lg:max-w-xl lg:text-5xl'>
                Unmatched Performance for Your Minecraft World
              </h2>
              <p className='max-w-xl text-left text-lg leading-relaxed tracking-tight text-muted-foreground lg:max-w-sm'>
                Say goodbye to lag. Our high-performance servers, powered by
                top-tier hardware and optimized for Minecraft, ensure smooth
                gameplay with zero interruptions. Whether you’re hosting a small
                survival world or a large modded server, we’ve got you covered.
              </p>
            </div>
          </div>
          <div className='relative aspect-video h-full w-full flex-1 rounded-md'>
            <Image
              src='/host/cpu.png'
              alt='Close up image of an AMD Ryzen CPU'
              fill={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
