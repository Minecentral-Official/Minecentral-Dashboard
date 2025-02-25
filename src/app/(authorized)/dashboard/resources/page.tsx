import { ProjectCreateDialog } from '@/features/resources/components/dialog/project-create.dialog';
import ResourceOverview from '@/features/resources/components/resource-overview';
import { ProjectsUserTable } from '@/features/resources/components/resource/table/plugins-table';
import resourceListAllByUserId from '@/features/resources/queries/resource-list-all-by-user-id.get';
import validateSession from '@/lib/auth/helpers/validate-session';

export default async function Page() {
  const { user } = await validateSession();
  const projects = await resourceListAllByUserId(user.id);
  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
      <div className='md:col-span-2'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-2xl font-semibold'>Published Resources</h2>
          <ProjectCreateDialog />
        </div>
        <ProjectsUserTable plugins={projects} />
      </div>
      <div>
        <h2 className='mb-4 text-2xl font-semibold'>Resource Overview</h2>
        <ResourceOverview plugins={projects} />
      </div>
    </div>
  );
}
