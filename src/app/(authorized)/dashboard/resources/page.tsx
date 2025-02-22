import { PlusCircleIcon } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import ResourceOverview from '@/features/resource-plugin/components/resource-overview';
import PluginCard from '@/features/resource-plugin/components/resource/plugin-card.view';
import pluginsGetByUserId from '@/features/resource-plugin/queries/plugins-by-user-id.get';
import validateSession from '@/lib/auth/helpers/validate-session';

export default async function Page() {
  const { user } = await validateSession();
  const plugins = await pluginsGetByUserId(user.id);
  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
      <div className='md:col-span-2'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-2xl font-semibold'>Published Resources</h2>
          <Link href='resources/create'>
            <Button>
              <PlusCircleIcon className='mr-2 h-4 w-4' /> Create New Resources
            </Button>
          </Link>
        </div>
        <div className='grid gap-4 lg:grid-cols-2'>
          {plugins &&
            plugins.map((plugin, index) => (
              <PluginCard key={index} {...plugin} />
            ))}
        </div>
      </div>
      <div>
        <h2 className='mb-4 text-2xl font-semibold'>Resource Overview</h2>
        <ResourceOverview plugins={plugins} />
      </div>
    </div>
  );
}
