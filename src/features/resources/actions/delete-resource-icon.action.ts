'use server';

import projectUpdate from '@/features/resources/mutations/update.project';
import { S_ProjectUploadIcon } from '@/features/resources/schemas/zod/s-project-upload-icon.zod';

export default async function resourceDeleteIconAction(serverId: string) {
  const parsedForm = await S_ProjectUploadIcon.safeParseAsync({ id: serverId });

  if (!parsedForm.success) {
    console.log(parsedForm.error);
    return { success: false, message: 'Invalid form data!' };
  }

  await projectUpdate(serverId, {
    iconUrl: null,
  });

  return {
    success: true,
    message: 'Icon updated successfully!',
  };
}
