'use server';

import { redirect } from 'next/navigation';

import serverDelete from '@/features/serverlist/mutations/delete.server';
import { serverGetById } from '@/features/serverlist/queries/server-by-id.get';
import userCanEditServer from '@/features/serverlist/queries/user-can-edit-server.boolean';

export default async function serverDeleteAction(
  _: unknown,
  formData: FormData,
) {
  const serverId = formData.get('id')?.toString();
  const confirmation = formData.get('confirmation')?.toString();

  if (!serverId) return { success: false, message: 'Invalid form data.' };
  if (!(await userCanEditServer(serverId)))
    return { success: false, message: 'You are not allowed to delete this listing.' };

  const server = await serverGetById(serverId);
  if (!server) return { success: false, message: 'Server listing not found.' };
  if (confirmation !== server.title)
    return {
      success: false,
      message: `Type ${server.title} to confirm deletion.`,
    };

  await serverDelete(serverId);
  redirect('/dashboard/servers?toast-success=true&toast-message=Server%20listing%20deleted&toast-id=delete-server');
}
