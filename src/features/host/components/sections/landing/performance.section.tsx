import { MoveUpRight } from 'lucide-react';

import SectionWrapper from '@/components/sections/primitives/section.wrapper';
import { Badge } from '@/components/ui/badge';

export const PerformanceSection = () => (
  <SectionWrapper>
    <div className='grid grid-cols-1 gap-10 lg:grid-cols-2'>
      <div className='flex flex-col items-start gap-4'>
        <div>
          <Badge>Performance</Badge>
        </div>
        <div className='flex flex-col gap-2'>
          <h2 className='font-regular text-left text-xl tracking-tighter md:text-3xl lg:max-w-xl lg:text-5xl'>
            Unleash Next-Level Performance with AMD Ryzen 5950X
          </h2>
          <p className='text-left text-lg leading-relaxed tracking-tight text-muted-foreground lg:max-w-sm'>
            Our servers, powered by the Ryzen 5950X, deliver unmatched speed and
            reliability for your Minecraft world.
          </p>
        </div>
      </div>
      <div className='flex items-center justify-center'>
        <div className='grid w-full grid-cols-1 gap-2 text-left sm:grid-cols-2 lg:grid-cols-2'>
          <div className='flex flex-col justify-between gap-0 rounded-md border p-6'>
            <MoveUpRight className='mb-10 h-4 w-4 text-primary' />
            <h2 className='font-regular flex max-w-xl flex-row items-end gap-4 text-left text-4xl tracking-tighter'>
              16
              {/* <span className='text-sm tracking-normal text-muted-foreground'>
                  cores
                </span> */}
            </h2>
            <p className='max-w-xl text-left text-base leading-relaxed tracking-tight text-muted-foreground'>
              Cores
            </p>
          </div>
          <div className='flex flex-col justify-between gap-0 rounded-md border p-6'>
            <MoveUpRight className='mb-10 h-4 w-4 text-primary' />
            <h2 className='font-regular flex max-w-xl flex-row items-end gap-4 text-left text-4xl tracking-tighter'>
              32
              {/* <span className='text-sm tracking-normal text-muted-foreground'>
                  -2%
                </span> */}
            </h2>
            <p className='max-w-xl text-left text-base leading-relaxed tracking-tight text-muted-foreground'>
              Threads
            </p>
          </div>
          <div className='flex flex-col justify-between gap-0 rounded-md border p-6'>
            <MoveUpRight className='mb-10 h-4 w-4 text-primary' />
            <h2 className='font-regular flex max-w-xl flex-row items-end gap-4 text-left text-4xl tracking-tighter'>
              4.9
              <span className='text-sm tracking-normal text-muted-foreground'>
                GHz
              </span>
            </h2>
            <p className='max-w-xl text-left text-base leading-relaxed tracking-tight text-muted-foreground'>
              Boost Clock
            </p>
          </div>
          <div className='flex flex-col justify-between gap-0 rounded-md border p-6'>
            <MoveUpRight className='mb-10 h-4 w-4 text-primary' />
            <h2 className='font-regular flex max-w-xl flex-row items-end gap-4 text-left text-4xl tracking-tighter'>
              72
              <span className='text-sm tracking-normal text-muted-foreground'>
                MB
              </span>
            </h2>
            <p className='max-w-xl text-left text-base leading-relaxed tracking-tight text-muted-foreground'>
              Total Cache
            </p>
          </div>
        </div>
      </div>
    </div>
  </SectionWrapper>
);
