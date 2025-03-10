import { TableProjectsLiked } from '@/features/resources/components/resource/table/table-projects-liked';
import resourceListLikedByUserId from '@/features/resources/queries/resource-list-liked-by-user-id.get';
import validateSession from '@/lib/auth/helpers/validate-session';

export default async function Page() {
  const { user } = await validateSession();
  const projects = await resourceListLikedByUserId(user.id);
  return (
    <div className='flex flex-col gap-4'>
      <h2 className='text-2xl font-semibold'>Liked Resources</h2>

      <TableProjectsLiked plugins={projects} />
    </div>
  );
}
