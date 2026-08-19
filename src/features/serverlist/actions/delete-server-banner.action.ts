'use server';

import serverUpdate from '@/features/serverlist/mutations/update.server';
import { serverGetById } from '@/features/serverlist/queries/server-by-id.get';
import userCanEditServer from '@/features/serverlist/queries/user-can-edit-server.boolean';
import { S_ServerUploadIcon } from '@/features/serverlist/schemas/zod/s-server-upload-icon.zod';

export default async function serverDeleteBannerAction(serverId: string) {
  const parsedForm = await S_ServerUploadIcon.safeParseAsync({ id: serverId });

  if (!parsedForm.success) {
    console.log(parsedForm.error);
    return { success: false, message: 'Invalid form data!' };
  }

  if (!(await userCanEditServer(serverId)))
    return {
      success: false,
      message: 'You are not allowed to edit this listing.',
    };

  const server = await serverGetById(serverId);

  await serverUpdate(serverId, {
    iconUrl: null,
    status: server?.status === 'published' ? 'draft' : undefined,
  });

  return {
    success: true,
    message: 'Banner updated successfully!',
  };
}
