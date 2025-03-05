'use server';

import { redirect } from 'next/navigation';

import projectDelete from '@/features/resources/mutations/delete.project';
import { projectGetById } from '@/features/resources/queries/project-by-id.get';
import {
  ACTIVITY,
  activityAddAction,
} from '@/lib/activity/mutations/activity.add';
import validateSession from '@/lib/auth/helpers/validate-session';

export default async function resourceDeleteAction(
  resourceId: string,
): Promise<boolean> {
  const { user } = await validateSession();

  const resource = await projectGetById(resourceId);

  if (!resource) return false;

  await projectDelete(resourceId);

  await activityAddAction(
    user.id,
    ACTIVITY.RESOURCE_DELETE,
    `${resource.title}`,
  );

  // revalidateTag(`tickets-user-${user.id}`);

  redirect(
    '/dashboard/resources?toast-success=true&toast-message=Resource%20deleted&toast-id=delete-project',
  );
}
