'use server';

import { parseWithZod } from '@conform-to/zod';
import { redirect } from 'next/navigation';

import serverCreate from '@/features/serverlist/mutations/create.server';
import serverAddressAvailable from '@/features/serverlist/queries/server-address-available.boolean';
import { serverCountByUserId } from '@/features/serverlist/queries/server-count-by-user-id.get';
import serverSlugAvailable from '@/features/serverlist/queries/server-slug-available.boolean';
import { S_ServerCreate } from '@/features/serverlist/schemas/zod/s-server-create.zod';
import {
  ACTIVITY,
  activityAddAction,
} from '@/lib/activity/mutations/activity.add';
import validateSession from '@/lib/auth/helpers/validate-session';
import { serverEnv } from '@/lib/env/server.env';

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

  const userServerCount = await serverCountByUserId(user.id);
  if (userServerCount >= serverEnv.SERVERLIST_MAX_SERVERS_PER_USER)
    return {
      success: false,
      message: `You can create up to ${serverEnv.SERVERLIST_MAX_SERVERS_PER_USER} server listings.`,
    };

  if (!(await serverSlugAvailable(formParsed.value.slug)))
    return { success: false, message: 'That URL is taken.' };

  if (
    !(await serverAddressAvailable(formParsed.value.ip, formParsed.value.port))
  )
    return {
      success: false,
      message: 'That server address is already listed.',
    };

  const newServer = await serverCreate({
    ...formParsed.value,
    userId: user.id,
  });

  await activityAddAction(user.id, ACTIVITY.SERVER_NEW, `${newServer.id}`);

  redirect(
    `/dashboard/servers/${newServer.slug}?toast-success=true&toast-message=Server%20listing%20created&toast-id=create-server`,
  );
}
