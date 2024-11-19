import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const HeroSection = () => (
  <div className='w-full py-20 lg:py-40'>
    <div className='container mx-auto'>
      <div className='grid grid-cols-1 items-center gap-8 lg:grid-cols-2'>
        <div className='flex flex-col gap-4'>
          <div>
            <Badge variant='outline'>🎉 We&apos;re live!</Badge>
          </div>
          <div className='flex flex-col gap-4'>
            <h1 className='font-regular max-w-lg text-left text-5xl tracking-tighter md:text-7xl'>
              Affordable, simple, and lightning-fast
            </h1>
            <p className='max-w-md text-left text-xl leading-relaxed tracking-tight text-muted-foreground'>
              Hosting your Minecraft server has never been this easy.
              Minecentral Hosting offers unbeatable prices and an intuitive
              setup process, so you can start crafting your world without the
              hassle.
            </p>
          </div>
          <div className='flex flex-row gap-4'>
            <Button size='lg' className='gap-4' variant='outline' asChild>
              <Link href='/host/pricing'>View Pricing</Link>
            </Button>
            <Button
              size='lg'
              variant='expandIcon'
              icon={ArrowRight}
              iconPlacement='right'
            >
              Get Started
            </Button>
          </div>
        </div>
        <div className='relative aspect-square overflow-hidden rounded-md'>
          <Image src='/host-hero.jpg' fill={true} alt='Host Hero Image' />
        </div>
      </div>
    </div>
  </div>
);
