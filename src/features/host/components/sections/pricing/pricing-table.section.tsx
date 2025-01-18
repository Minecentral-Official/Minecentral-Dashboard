import { Minus, MoveRight, PhoneCall } from 'lucide-react';

import SectionWrapper from '@/components/sections/primitives/section.wrapper';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { hostGetDefaultProducts } from '@/features/host/queries/customer/default-product.get';

export default async function PricingTableSection() {
  const defaultProducts = await hostGetDefaultProducts();

  return (
    <SectionWrapper>
      <div className='flex flex-col items-center justify-center gap-4 text-center'>
        <Badge>Pricing</Badge>
        <div className='flex flex-col gap-2'>
          <h2 className='font-regular max-w-xl text-center text-3xl tracking-tighter md:text-5xl'>
            Prices that make sense!
          </h2>
          <p className='max-w-xl text-center text-lg leading-relaxed tracking-tight text-muted-foreground'>
            Managing a small business today is already tough.
          </p>
        </div>
        <div className='grid w-full grid-cols-3 divide-x pt-20 text-left lg:grid-cols-4'>
          <div className='col-span-3 lg:col-span-1'></div>
          <div className='row-span-4 grid grid-rows-subgrid flex-col gap-2 px-3 py-1 md:px-6 md:py-4'>
            <p className='grid-rows-1 text-2xl'>Iron</p>
            <p className='grid-rows-2 text-sm text-muted-foreground'>
              {defaultProducts[0].description}
            </p>
            <p className='mt-8 flex grid-rows-3 flex-col gap-2 text-xl lg:flex-row lg:items-center'>
              <span className='text-4xl'>
                ${(defaultProducts[0].prices[0].price ?? 0) / 100}
              </span>
              <span className='text-sm text-muted-foreground'> / month</span>
            </p>
            <Button variant='outline' className='mt-8 grid-rows-4 gap-4'>
              Try it <MoveRight className='h-4 w-4' />
            </Button>
          </div>
          <div className='row-span-4 grid grid-rows-subgrid flex-col gap-2 px-3 py-1 md:px-6 md:py-4'>
            <p className='grid-rows-1 text-2xl'>Gold</p>
            <p className='grid-rows-2 text-sm text-muted-foreground'>
              {defaultProducts[1].description}
            </p>
            <p className='mt-8 flex grid-rows-3 flex-col gap-2 text-xl lg:flex-row lg:items-center'>
              <span className='text-4xl'>
                ${(defaultProducts[1].prices[0].price ?? 0) / 100}
              </span>
              <span className='text-sm text-muted-foreground'> / month</span>
            </p>
            <Button className='mt-8 grid-rows-4 gap-4'>
              Try it <MoveRight className='h-4 w-4' />
            </Button>
          </div>
          <div className='row-span-4 grid grid-rows-subgrid flex-col gap-2 px-3 py-1 md:px-6 md:py-4'>
            <p className='grid-rows-1 text-2xl'>Emerald</p>
            <p className='grid-rows-2 text-sm text-muted-foreground'>
              Our goal is to streamline SMB trade, making it easier and faster
              than ever for everyone and everywhere.
            </p>
            <p className='mt-8 flex grid-rows-3 flex-col gap-2 text-xl lg:flex-row lg:items-center'>
              <span className='text-4xl'>$40</span>
              <span className='text-sm text-muted-foreground'> / month</span>
            </p>
            <Button variant='outline' className='mt-8 grid-rows-4 gap-4'>
              Contact us <PhoneCall className='h-4 w-4' />
            </Button>
          </div>
          <div></div>
          <div></div>
          <div></div>
          <div className='col-span-3 px-3 py-4 lg:col-span-1 lg:px-6'>
            <b>Specs</b>
          </div>
          <div></div>
          <div></div>
          <div></div>
          {/* New Line */}
          <div className='col-span-3 px-3 py-4 lg:col-span-1 lg:px-6'>RAM</div>
          <div className='flex justify-center px-3 py-1 md:px-6 md:py-4'>
            <p className='text-sm text-muted-foreground'>
              {defaultProducts[0].metadata.ram} GB
            </p>
          </div>
          <div className='flex justify-center px-3 py-1 md:px-6 md:py-4'>
            <p className='text-sm text-muted-foreground'>
              {defaultProducts[1].metadata.ram} GB
            </p>
          </div>
          <div className='flex justify-center px-3 py-1 md:px-6 md:py-4'>
            <p className='text-sm text-muted-foreground'>
              <Minus className='h-4 w-4 text-muted-foreground' />
            </p>
          </div>
          {/* New Line */}
          <div className='col-span-3 px-3 py-4 lg:col-span-1 lg:px-6'>
            CPU Threads
          </div>
          <div className='flex justify-center px-3 py-1 md:px-6 md:py-4'>
            <p className='text-sm text-muted-foreground'>
              {defaultProducts[0].metadata.cpu} Threads
            </p>
          </div>
          <div className='flex justify-center px-3 py-1 md:px-6 md:py-4'>
            <p className='text-sm text-muted-foreground'>
              {defaultProducts[1].metadata.cpu} Threads
            </p>
          </div>
          <div className='flex justify-center px-3 py-1 md:px-6 md:py-4'>
            <p className='text-sm text-muted-foreground'>
              <Minus className='h-4 w-4 text-muted-foreground' />
            </p>
          </div>
          {/* New Line */}
          <div className='col-span-3 px-3 py-4 lg:col-span-1 lg:px-6'>
            Sub-Servers
          </div>
          <div className='flex justify-center px-3 py-1 md:px-6 md:py-4'>
            <p className='text-sm text-muted-foreground'>
              {defaultProducts[0].metadata.splits}
            </p>
          </div>
          <div className='flex justify-center px-3 py-1 md:px-6 md:py-4'>
            <p className='text-sm text-muted-foreground'>
              {defaultProducts[1].metadata.splits}
            </p>
          </div>
          <div className='flex justify-center px-3 py-1 md:px-6 md:py-4'>
            <p className='text-sm text-muted-foreground'>
              <Minus className='h-4 w-4 text-muted-foreground' />
            </p>
          </div>
          {/* New Line */}
          <div className='col-span-3 px-3 py-4 lg:col-span-1 lg:px-6'>
            Databases
          </div>
          <div className='flex justify-center px-3 py-1 md:px-6 md:py-4'>
            <p className='text-sm text-muted-foreground'>
              {defaultProducts[0].metadata.databases}
            </p>
          </div>
          <div className='flex justify-center px-3 py-1 md:px-6 md:py-4'>
            <p className='text-sm text-muted-foreground'>
              {defaultProducts[1].metadata.databases}
            </p>
          </div>
          <div className='flex justify-center px-3 py-1 md:px-6 md:py-4'>
            <p className='text-sm text-muted-foreground'>
              <Minus className='h-4 w-4 text-muted-foreground' />
            </p>
          </div>
          {/* New Line */}
          <div className='col-span-3 px-3 py-4 lg:col-span-1 lg:px-6'>Disk</div>
          <div className='flex justify-center px-3 py-1 md:px-6 md:py-4'>
            <p className='text-sm text-muted-foreground'>
              {defaultProducts[0].metadata.disk} GiB
            </p>
          </div>
          <div className='flex justify-center px-3 py-1 md:px-6 md:py-4'>
            <p className='text-sm text-muted-foreground'>
              {defaultProducts[1].metadata.disk} GiB
            </p>
          </div>
          <div className='flex justify-center px-3 py-1 md:px-6 md:py-4'>
            <p className='text-sm text-muted-foreground'>
              <Minus className='h-4 w-4 text-muted-foreground' />
            </p>
          </div>
          {/* New Line */}
          <div className='col-span-3 px-3 py-4 lg:col-span-1 lg:px-6'>
            Backups
          </div>
          <div className='flex justify-center px-3 py-1 md:px-6 md:py-4'>
            <p className='text-sm text-muted-foreground'>
              {defaultProducts[0].metadata.backups}
            </p>
          </div>
          <div className='flex justify-center px-3 py-1 md:px-6 md:py-4'>
            <p className='text-sm text-muted-foreground'>
              {defaultProducts[1].metadata.backups}
            </p>
          </div>
          <div className='flex justify-center px-3 py-1 md:px-6 md:py-4'>
            <p className='text-sm text-muted-foreground'>
              <Minus className='h-4 w-4 text-muted-foreground' />
            </p>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
