import { User } from 'lucide-react';

import SectionWrapper from '@/components/sections/primitives/section.wrapper';
import { Badge } from '@/components/ui/badge';

export default function PerformanceFeaturesGridSection() {
  return (
    <SectionWrapper>
      <div className='flex flex-col gap-10'>
        <div className='flex flex-col items-start gap-4'>
          <div>
            <Badge>Platform</Badge>
          </div>
          <div className='flex flex-col gap-2'>
            <h2 className='font-regular max-w-xl text-left text-3xl tracking-tighter md:text-5xl'>
              Something new!
            </h2>
            <p className='max-w-xl text-left text-lg leading-relaxed tracking-tight text-muted-foreground lg:max-w-lg'>
              Managing a small business today is already tough.
            </p>
          </div>
        </div>
        <div className='flex flex-col gap-8 sm:grid sm:grid-cols-2 lg:grid lg:grid-cols-3 xl:grid-cols-4'>
          <div className='flex aspect-square h-full w-full flex-col justify-between rounded-md bg-muted p-6 lg:col-span-2 lg:row-span-2'>
            <User className='h-8 w-8 stroke-1' />
            <div className='flex flex-col'>
              <h3 className='text-xl tracking-tight'>Pay supplier invoices</h3>
              <p className='max-w-xs text-base text-muted-foreground'>
                Our goal is to streamline SMB trade, making it easier and faster
                than ever.
              </p>
            </div>
          </div>

          <div className='flex aspect-square h-full flex-col justify-between rounded-md bg-muted p-6'>
            <User className='h-8 w-8 stroke-1' />
            <div className='flex flex-col'>
              <h3 className='text-xl tracking-tight'>Pay supplier invoices</h3>
              <p className='max-w-xs text-base text-muted-foreground'>
                Our goal is to streamline SMB trade, making it easier and faster
                than ever.
              </p>
            </div>
          </div>

          <div className='flex aspect-square h-full flex-col justify-between rounded-md bg-muted p-6'>
            <User className='h-8 w-8 stroke-1' />
            <div className='flex flex-col'>
              <h3 className='text-xl tracking-tight'>Pay supplier invoices</h3>
              <p className='max-w-xs text-base text-muted-foreground'>
                Our goal is to streamline SMB trade, making it easier and faster
                than ever.
              </p>
            </div>
          </div>

          <div className='flex aspect-square h-full flex-col justify-between rounded-md bg-muted p-6'>
            <User className='h-8 w-8 stroke-1' />
            <div className='flex flex-col'>
              <h3 className='text-xl tracking-tight'>Pay supplier invoices</h3>
              <p className='max-w-xs text-base text-muted-foreground'>
                Our goal is to streamline SMB trade, making it easier and faster
                than ever.
              </p>
            </div>
          </div>

          <div className='flex aspect-square h-full flex-col justify-between rounded-md bg-muted p-6'>
            <User className='h-8 w-8 stroke-1' />
            <div className='flex flex-col'>
              <h3 className='text-xl tracking-tight'>Pay supplier invoices</h3>
              <p className='max-w-xs text-base text-muted-foreground'>
                Our goal is to streamline SMB trade, making it easier and faster
                than ever.
              </p>
            </div>
          </div>

          <div className='flex aspect-square h-full flex-col justify-between rounded-md bg-muted p-6'>
            <User className='h-8 w-8 stroke-1' />
            <div className='flex flex-col'>
              <h3 className='text-xl tracking-tight'>Pay supplier invoices</h3>
              <p className='max-w-xs text-base text-muted-foreground'>
                Our goal is to streamline SMB trade, making it easier and faster
                than ever.
              </p>
            </div>
          </div>

          <div className='flex aspect-square h-full flex-col justify-between rounded-md bg-muted p-6'>
            <User className='h-8 w-8 stroke-1' />
            <div className='flex flex-col'>
              <h3 className='text-xl tracking-tight'>Pay supplier invoices</h3>
              <p className='max-w-xs text-base text-muted-foreground'>
                Our goal is to streamline SMB trade, making it easier and faster
                than ever.
              </p>
            </div>
          </div>

          <div className='flex h-full flex-col justify-between rounded-md bg-muted p-6 lg:col-span-2'>
            <User className='h-8 w-8 stroke-1' />
            <div className='flex flex-col'>
              <h3 className='text-xl tracking-tight'>Pay supplier invoices</h3>
              <p className='max-w-xs text-base text-muted-foreground'>
                Our goal is to streamline SMB trade, making it easier and faster
                than ever.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
