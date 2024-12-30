import { ArrowRight, Mail } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const CTASection = () => (
  <div className='w-full py-20 lg:py-40'>
    <div className='container mx-auto'>
      <div className='flex flex-col items-center gap-8 rounded-md bg-muted p-4 text-center lg:p-14'>
        <div>
          <Badge>Get started</Badge>
        </div>
        <div className='flex flex-col gap-2'>
          <h3 className='font-regular max-w-xl text-3xl tracking-tighter md:text-5xl'>
            Try our services today!
          </h3>
          <p className='max-w-xl text-lg leading-relaxed tracking-tight text-muted-foreground'>
            Managing a Minecraft server is a hassle already! Let us help you get
            started with a low barrier to entry hosting solution! Our goal is to
            lower entry cost while allowing for infinite future expansion when
            you are ready!
          </p>
        </div>
        <div className='flex flex-row gap-4'>
          <Button className='gap-4' variant='outline'>
            Drop us a message <Mail className='h-4 w-4' />
          </Button>
          <Button
            effect='expandIcon'
            icon={ArrowRight}
            iconPlacement='right'
            asChild
          >
            <Link href='/sign-in'>Sign up here</Link>
          </Button>
        </div>
      </div>
    </div>
  </div>
);
