import { Banknote, Gauge, ServerOff, Shield } from 'lucide-react';

import { Badge } from '@/components/ui/badge';

export const FeaturesSection = () => (
  <div className='w-full py-20 lg:py-40'>
    <div className='container mx-auto'>
      <div className='flex flex-col gap-10'>
        <div className='flex flex-col items-start gap-4'>
          <div>
            <Badge>Host</Badge>
          </div>
          <div className='flex flex-col gap-2'>
            <h2 className='font-regular max-w-xl text-balance text-left text-3xl tracking-tighter md:text-5xl'>
              Hosting Made Simple and Powerful
            </h2>
            <p className='max-w-xl text-balance text-left text-lg leading-relaxed tracking-tight text-muted-foreground lg:max-w-lg'>
              Explore the tools and perks designed to level up your server
              experience.
            </p>
          </div>
        </div>
        <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
          <div className='flex aspect-square h-full flex-col justify-between rounded-md bg-muted p-6 lg:col-span-2 lg:aspect-auto'>
            <Gauge className='h-8 w-8 stroke-1' />
            <div className='flex flex-col'>
              <h3 className='text-xl tracking-tight'>
                Blazing-Fast Performance
              </h3>
              <p className='max-w-xs text-base text-muted-foreground'>
                Experience lightning-speed gameplay with our high-performance
                processors.
              </p>
            </div>
          </div>
          <div className='flex aspect-square flex-col justify-between rounded-md bg-muted p-6'>
            <ServerOff className='h-8 w-8 stroke-1' />
            <div className='flex flex-col'>
              <h3 className='text-xl tracking-tight'>
                Seamless Server Splitting
              </h3>
              <p className='max-w-xs text-base text-muted-foreground'>
                Run multiple game modes or worlds effortlessly with our
                server-splitting capabilities.
              </p>
            </div>
          </div>

          <div className='flex aspect-square flex-col justify-between rounded-md bg-muted p-6'>
            <Shield className='h-8 w-8 stroke-1' />
            <div className='flex flex-col'>
              <h3 className='text-xl tracking-tight'>
                Support That&apos;s Always There
              </h3>
              <p className='max-w-xs text-base text-muted-foreground'>
                With our first-class support and ticketing system. We&apos;re
                here to make sure your server runs smoothly.
              </p>
            </div>
          </div>
          <div className='flex aspect-square h-full flex-col justify-between rounded-md bg-muted p-6 lg:col-span-2 lg:aspect-auto'>
            <Banknote className='h-8 w-8 stroke-1' />
            <div className='flex flex-col'>
              <h3 className='text-xl tracking-tight'>Hosting Your Way</h3>
              <p className='max-w-xs text-base text-muted-foreground'>
                No two servers are alike. Choose a plan that matches your
                vision, with resources designed to meet your unique goals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
