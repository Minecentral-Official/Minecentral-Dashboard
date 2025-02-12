import ServiceLinkCard from '@/components/cards/service-link.card';
import SectionWrapper from '@/components/sections/primitives/section.wrapper';
import { Badge } from '@/components/ui/badge';

export default function ServiceSelectionSection() {
  return (
    <SectionWrapper>
      <div className='flex flex-col gap-4'>
        <div>
          <Badge variant='outline'>🎉 We&apos;re live!</Badge>
        </div>
        <div className='flex flex-col gap-4'>
          <h1 className='font-regular max-w-lg text-left text-5xl tracking-tighter md:text-7xl'>
            Explore Minecentral&apos;s services
          </h1>
        </div>
        <div className='mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3'>
          <ServiceLinkCard
            title='Hosting'
            description='Rent your own Minecraft server and play together for cheap'
            href='/hosting'
          />
          <ServiceLinkCard
            title='Resources'
            description='Find community plugins and easily add to your game'
            href='/resources'
            enabled={false}
          />
          <ServiceLinkCard
            title='Worlds'
            description='Find and explore community servers you can connect to now!'
            href='/worlds'
            enabled={false}
          />
          <ServiceLinkCard
            title='Docs'
            description='Find out how to create and manage your Minecentral Services'
            href='https://docs.minecentral.net'
            enabled={true}
          />
        </div>
      </div>
    </SectionWrapper>
  );
}
