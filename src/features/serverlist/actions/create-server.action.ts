'use server';

import { parseWithZod } from '@conform-to/zod';
import { redirect } from 'next/navigation';

import serverCreate from '@/features/serverlist/mutations/create.server';
import { serverGetByUserId } from '@/features/serverlist/queries/server-by-user-id.get';
import { S_ServerCreate } from '@/features/serverlist/schemas/zod/s-server-create.zod';
import {
  ACTIVITY,
  activityAddAction,
} from '@/lib/activity/mutations/activity.add';
import validateSession from '@/lib/auth/helpers/validate-session';

export default async function serverCreateAction(
  // prevState: unknown
  _: unknown,
  formData: FormData,
) {
  const { user } = await validateSession();
  const formParsed = parseWithZod(formData, {
    schema: S_ServerCreate,
  });

  if (formParsed.status !== 'success') {
    console.log(formParsed.error);
    return { success: false, message: 'Invalid form data!' };
  }

  //Check if one already exists
  const currentUsersServer = await serverGetByUserId(user.id);
  if (currentUsersServer !== undefined)
    return { success: false, message: 'You already own a Realm!' };

  const newServer = await serverCreate({
    ...formParsed.value,
    userId: user.id,
  });

  await activityAddAction(user.id, ACTIVITY.SERVER_NEW, `${newServer.id}`);

  redirect(
    `/dashboard/servers/${newServer.slug}?toast-success=true&toast-message=Server%20successfully%20created&toast-id=create-server`,
  );
}
