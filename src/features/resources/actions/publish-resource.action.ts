'use server';

import { revalidateTag } from 'next/cache';

import projectUpdate from '@/features/resources/mutations/update.project';
import projectCanEdit from '@/features/resources/queries/user-can-edit-resource.boolean';
import validateRole from '@/lib/auth/helpers/validate-role';

export default async function resourcePublishAction(resourceId: string) {
  if (!(await projectCanEdit(resourceId))) {
    return { success: false, message: 'No Permission', liked: false };
  }
  const isAdmin = await validateRole('admin');
  await projectUpdate(resourceId, { status: isAdmin ? 'accepted' : 'pending' });
  revalidateTag(`resource-id-${resourceId}`);
  return { success: true };
}
