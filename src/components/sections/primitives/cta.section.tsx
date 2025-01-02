import { ReactNode } from 'react';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import SectionWrapper from '@/components/sections/primitives/section.wrapper';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type CTASectionProps = {
  badgeChildren: ReactNode;
  title: string;
  subtitle: string;
  primaryButtonChildren: ReactNode;
  primaryButtonHref: string;
  secondaryButtonChildren: ReactNode;
  secondaryButtonHref: string;
};

export const CtaSection = ({
  badgeChildren,
  title,
  subtitle,
  primaryButtonChildren,
  primaryButtonHref,
  secondaryButtonChildren,
  secondaryButtonHref,
}: CTASectionProps) => (
  <SectionWrapper>
    <div className='flex flex-col items-center gap-8 rounded-md bg-muted p-4 text-center lg:p-14'>
      <div>
        <Badge>{badgeChildren}</Badge>
      </div>
      <div className='flex flex-col gap-2'>
        <h3 className='font-regular max-w-xl text-3xl tracking-tighter md:text-5xl'>
          {title}
        </h3>
        <p className='max-w-xl text-lg leading-relaxed tracking-tight text-muted-foreground'>
          {subtitle}
        </p>
      </div>
      <div className='flex flex-row gap-4'>
        <Button className='gap-4' variant='outline'>
          <Link href={secondaryButtonHref}>{secondaryButtonChildren}</Link>
        </Button>
        <Button
          effect='expandIcon'
          icon={ArrowRight}
          iconPlacement='right'
          asChild
        >
          <Link href={primaryButtonHref}>{primaryButtonChildren}</Link>
        </Button>
      </div>
    </div>
  </SectionWrapper>
);
