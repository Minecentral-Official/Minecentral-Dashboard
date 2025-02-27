'use server';

import { parseWithZod } from '@conform-to/zod';
import { NextResponse } from 'next/server';

import projectCreate from '@/features/resources/mutations/create.project';
import { resourceUpdateGeneralZod } from '@/features/resources/schemas/zod/update-general.zod';
import {
  ACTIVITY,
  activityAddAction,
} from '@/lib/activity/mutations/activity.add';
import validateSession from '@/lib/auth/helpers/validate-session';
import { uploadThing_File } from '@/lib/uploadthing/upload-file';

export default async function resourceUpdateGeneralAction(
  // prevState: unknown
  _: unknown,
  formData: FormData,
) {
  const { user } = await validateSession();
  const formParsed = parseWithZod(formData, {
    schema: resourceUpdateGeneralZod,
  });

  if (formParsed.status !== 'success') {
    return formParsed.reply();
  }

  //DeConstruct fields
  const { resourceId, newIconFile, newSlug, newSubtitle, newTitle } =
    formParsed.value;

  const iconUrl = await uploadThing_File(newIconFile);
  if (!fileUpload) {
    return;
  }
  fileUrl = fileUpload.ufsUrl;

  const newPlugin = await projectCreate({
    title,
    subtitle,
    slug,
    userId: user.id,
  });

  await activityAddAction(user.id, ACTIVITY.NEW_RESOURCE, `${newPlugin.id}`);

  // revalidateTag(`tickets-user-${user.id}`);
  return NextResponse.json({ success: true });
}
// prevState: unknown
//   _: unknown,
//   formData: FormData,
// ) {
//   const pluginData = await resourceUploadImage(resourceId, imageUrl);

//   await activityAddAction(
//     userId,
//     ACTIVITY.EDIT_RESOURCE,
//     `${pluginData[0].title}`,
//     `Uploaded New Icon`,
//   );

//   return;

//   // redirect(
//   //   `/resources/${pluginData[0].id}/?toast-success=true&toast-message=Resource%20icon%20updated&toast-id=icon-upload`,
//   // );
// }
