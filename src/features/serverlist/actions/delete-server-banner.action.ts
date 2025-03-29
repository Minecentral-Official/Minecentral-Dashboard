'use server';

import serverUpdate from '@/features/serverlist/mutations/update.server';
import { S_ServerUploadIcon } from '@/features/serverlist/schemas/zod/s-server-upload-icon.zod';

export default async function serverDeleteBannerAction(serverId: string) {
  const parsedForm = await S_ServerUploadIcon.safeParseAsync({ id: serverId });

  if (!parsedForm.success) {
    console.log(parsedForm.error);
    return { success: false, message: 'Invalid form data!' };
  }

  await serverUpdate(serverId, {
    iconUrl: null,
  });

  return {
    success: true,
    message: 'Banner updated successfully!',
  };
}
