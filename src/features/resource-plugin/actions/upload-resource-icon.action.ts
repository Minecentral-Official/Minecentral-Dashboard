'use server';

import { parseWithZod } from '@conform-to/zod';
import { redirect } from 'next/navigation';

import resourceUploadImage from '@/features/resource-plugin/mutations/upload-image.resource';
import { pluginUploadIconZod } from '@/features/resource-plugin/schemas/zod/upload-icon.zod';
import {
  ACTIVITY,
  activityAddAction,
} from '@/lib/activity/mutations/activity.add';
import validateSession from '@/lib/auth/helpers/validate-session';
import { uploadThing_File } from '@/lib/uploadthing/upload-file';

export default async function resourceUploadIconAction(
  // prevState: unknown
  _: unknown,
  formData: FormData,
) {
  const { user } = await validateSession();
  const formParsed = parseWithZod(formData, {
    schema: pluginUploadIconZod,
  });

  if (formParsed.status !== 'success') {
    return formParsed.reply();
  }

  //DeConstruct fields
  const { image, resourceId } = formParsed.value;

  const fileData = await uploadThing_File(image);
  if (!fileData) {
    return;
  }

  const pluginData = await resourceUploadImage(resourceId, fileData.url);

  await activityAddAction(
    user.id,
    ACTIVITY.EDIT_RESOURCE,
    `${pluginData[0].title}`,
    `Uploaded New Icon`,
  );

  redirect(
    `/resources/${pluginData[0].id}/?toast-success=true&toast-message=Resource%20icon%20updated&toast-id=icon-upload`,
  );
}
