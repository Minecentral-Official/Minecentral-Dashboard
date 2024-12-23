import ServiceLinkCard from '@/components/services/general/service-link.card';
import { Badge } from '@/components/ui/badge';

export default function ServiceSelectionSection() {
  return (
    <div className='w-full py-20 lg:py-40'>
      <div className='container mx-auto'>
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
              title='Host'
              description='Rent your own Minecraft server and play together for cheap'
              href='/host'
            />
            <ServiceLinkCard
              title='Plugins'
              description='Find community plugins and easily add to your game'
              href='/host'
              enabled={false}
            />
            <ServiceLinkCard
              title='Servers'
              description='Find and explore community servers you can connect to now!'
              href='/host'
              enabled={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
