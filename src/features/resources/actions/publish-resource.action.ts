'use server';

import projectUpdate from '@/features/resources/mutations/update.project';
import projectCanEdit from '@/features/resources/queries/user-can-edit-resource.boolean';
import { hasPermission } from '@/lib/auth/helpers/permissions';
import validateSession from '@/lib/auth/helpers/validate-session';
import { invalidateTag as revalidateTag } from '@/lib/cache/invalidate-tag';

export default async function resourcePublishAction(resourceId: string) {
  if (!(await projectCanEdit(resourceId))) {
    return { success: false, message: 'No Permission', liked: false };
  }
  const { user } = await validateSession();
  const isAdmin = hasPermission(user.role, 'resources:moderate');
  await projectUpdate(resourceId, { status: isAdmin ? 'accepted' : 'pending' });
  revalidateTag(`resource-id-${resourceId}`);
  return { success: true };
}
