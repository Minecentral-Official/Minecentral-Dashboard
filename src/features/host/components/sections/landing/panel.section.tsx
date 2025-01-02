import { Check } from 'lucide-react';
import Image from 'next/image';

import SectionWrapper from '@/components/sections/primitives/section.wrapper';
import { Badge } from '@/components/ui/badge';

export const PanelSection = () => (
  <SectionWrapper>
    <div className='container grid grid-cols-1 items-center gap-8 rounded-lg border py-8 lg:grid-cols-2'>
      <div className='flex flex-col gap-10'>
        <div className='flex flex-col gap-4'>
          <div>
            <Badge>Admin Panel</Badge>
          </div>
          <div className='flex flex-col gap-2'>
            <h2 className='font-regular max-w-xl text-left text-3xl tracking-tighter lg:text-5xl'>
              Control Made Easy
            </h2>
            <p className='max-w-xl text-left text-lg leading-relaxed tracking-tight text-muted-foreground'>
              Built with gamers in mind, our Minecentral Panel offers powerful
              features and a user-friendly interface, so you can focus on
              playing, not managing.
            </p>
          </div>
        </div>
        <div className='grid grid-cols-1 items-start gap-6 sm:grid-cols-3 lg:grid-cols-1 lg:pl-6'>
          <div className='flex flex-row items-start gap-6'>
            <Check className='mt-2 h-4 w-4 text-primary' />
            <div className='flex flex-col gap-1'>
              <p>Instant Server Setup</p>
              <p className='text-sm text-muted-foreground'>
                Create and launch your Minecraft server in just a few clicks.
              </p>
            </div>
          </div>
          <div className='flex flex-row items-start gap-6'>
            <Check className='mt-2 h-4 w-4 text-primary' />
            <div className='flex flex-col gap-1'>
              <p>Mod and Plugin Support</p>
              <p className='text-sm text-muted-foreground'>
                Seamlessly install, update, or remove mods and plugins.
              </p>
            </div>
          </div>
          <div className='flex flex-row items-start gap-6'>
            <Check className='mt-2 h-4 w-4 text-primary' />
            <div className='flex flex-col gap-1'>
              <p>Advanced Console Access</p>
              <p className='text-sm text-muted-foreground'>
                Easily execute commands, review logs, and troubleshoot.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className='relative aspect-square overflow-hidden rounded-md bg-muted'>
        <Image
          src={'/host/panel-console.png'}
          alt='Server Panel'
          fill={true}
          objectFit='cover'
        />
      </div>
    </div>
  </SectionWrapper>
);
