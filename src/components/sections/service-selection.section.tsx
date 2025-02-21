import { ArrowRight } from 'lucide-react';

import ServiceLinkCard from '@/components/cards/service-link.card';
import SectionWrapper from '@/components/sections/primitives/section.wrapper';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function ServiceSelectionSection() {
  return (
    <SectionWrapper>
      <div className='flex flex-col items-center gap-6 text-center'>
        <Badge variant='outline' className='px-3 py-1 text-sm'>
          🎉 We&apos;re live!
        </Badge>
        <h1 className='max-w-2xl text-5xl font-bold tracking-tighter md:text-7xl'>
          Explore our services
        </h1>
        <p className='max-w-xl text-lg text-muted-foreground'>
          Discover the best hosting, resources, and tools for your Minecraft
          experience.
        </p>
        <div className='mt-6 grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {services.map((service, index) => (
            <ServiceLinkCard key={index} {...service} />
          ))}
        </div>
        <Button size='lg' className='mt-8'>
          Get Started <ArrowRight className='ml-2 h-4 w-4' />
        </Button>
      </div>
    </SectionWrapper>
  );
}

const services = [
  {
    title: 'Hosting',
    description: 'Rent a Minecraft server and play together',
    href: '/hosting',
    enabled: true,
  },
  {
    title: 'Plugins & Resources',
    description:
      'Find fun community made plugins, texture-packs, mod-packs and more!',
    href: '/resources',
    enabled: true,
  },
  {
    title: 'Worlds',
    description: 'A place to boast about your Minecraft server!',
    href: '/worlds',
    enabled: false,
  },
  {
    title: 'Docs',
    description: 'Find out how to manage your Minecentral Services',
    href: 'https://docs.minecentral.net',
    enabled: true,
  },
];
