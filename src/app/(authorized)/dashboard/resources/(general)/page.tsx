import { PlusCircleIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ProjectCreateDialog } from '@/features/resources/components/dialog/project-create.dialog';
import ResourceOverview from '@/features/resources/components/resource-overview';
import { TableProjectsUser } from '@/features/resources/components/resource/table/table-projects-user';
import resourceListAllByUserId from '@/features/resources/queries/resource-list-all-by-user-id.get';
import validateSession from '@/lib/auth/helpers/validate-session';

export default async function Page() {
  const { user } = await validateSession();
  const projects = await resourceListAllByUserId(user.id);
  return (
    <div className='flex flex-col-reverse gap-6 lg:grid lg:grid-cols-3'>
      <div className='md:col-span-2'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-2xl font-semibold'>Published Resources</h2>
          <ProjectCreateDialog>
            <Button className='flex flex-row items-center gap-2'>
              <PlusCircleIcon className='h-4 w-4' />
              New Project
            </Button>
          </ProjectCreateDialog>
        </div>
        <TableProjectsUser plugins={projects} />
      </div>
      <div>
        <ResourceOverview plugins={projects} />
      </div>
    </div>
  );
}
