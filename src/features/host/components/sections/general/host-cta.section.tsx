import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import SectionWrapper from '@/components/sections/primitives/section.wrapper';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function HostCtaSection() {
  return (
    <SectionWrapper>
      <div className='flex flex-col items-center gap-8 rounded-md bg-muted p-4 text-center lg:p-14'>
        <div>
          <Badge>Get Started</Badge>
        </div>
        <div className='flex flex-col gap-2'>
          <h3 className='font-regular max-w-xl text-balance text-3xl tracking-tighter md:text-5xl'>
            Try our hosting service today!
          </h3>
          <p className='max-w-xl text-lg leading-relaxed tracking-tight text-muted-foreground'>
            Get unparalleled performance for cheap
          </p>
        </div>
        <div className='flex flex-row gap-4'>
          <Button className='gap-4' variant='outline'>
            <Link href='/hosting/pricing'>View pricing</Link>
          </Button>
          <Button
            effect='expandIcon'
            icon={ArrowRight}
            iconPlacement='right'
            asChild
          >
            <Link href='/sign-in'>Get started</Link>
          </Button>
        </div>
      </div>
    </SectionWrapper>
  );
}
