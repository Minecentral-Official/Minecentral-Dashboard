import { PlusCircleIcon } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import ResourceList from '@/features/resource/components/resource-list';
import ResourceOverview from '@/features/resource/components/resource-overview';

export default function Page() {
  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
      <div className='md:col-span-2'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-2xl font-semibold'>Published Resources</h2>
          <Link href='/dashboard/resource/new'>
            <Button>
              <PlusCircleIcon className='mr-2 h-4 w-4' /> Create New Resources
            </Button>
          </Link>
        </div>
        <ResourceList />
      </div>
      <div>
        <h2 className='mb-4 text-2xl font-semibold'>Resource Overview</h2>
        <ResourceOverview />
      </div>
    </div>
  );
}
