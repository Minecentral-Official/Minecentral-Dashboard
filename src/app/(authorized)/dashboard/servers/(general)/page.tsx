import { PlusCircleIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import ResourceOverview from '@/features/resources/components/resource-overview';
import resourceListAllByUserId from '@/features/resources/queries/resource-list-all-by-user-id.get';
import { ServerCreateDialog } from '@/features/serverlist/dialog/server-create.dialog';
import validateSession from '@/lib/auth/helpers/validate-session';

export default async function Page() {
  const { user } = await validateSession();
  const projects = await resourceListAllByUserId(user.id);
  return (
    <div className='flex flex-col-reverse gap-6 lg:grid lg:grid-cols-3'>
      <div className='md:col-span-2'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-2xl font-semibold'>My Realm</h2>
          <ServerCreateDialog>
            <Button className='flex flex-row items-center gap-2'>
              <PlusCircleIcon className='h-4 w-4' />
              Create my Realm
            </Button>
          </ServerCreateDialog>
        </div>
      </div>
      <div>
        <h2 className='mb-4 text-2xl font-semibold'>Realm Overview</h2>
        <ResourceOverview plugins={projects} />
      </div>
    </div>
  );
}
