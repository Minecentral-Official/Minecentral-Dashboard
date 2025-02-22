'use server';

import { parseWithZod } from '@conform-to/zod';
import { redirect } from 'next/navigation';

import resourceCreate from '@/features/resource-plugin/mutations/create.resource';
import { pluginCreateZod } from '@/features/resource-plugin/schemas/zod/create-plugin.zod';
import {
  ACTIVITY,
  activityAddAction,
} from '@/lib/activity/mutations/activity.add';
import validateSession from '@/lib/auth/helpers/validate-session';
import { uploadThing_File } from '@/lib/uploadthing/upload-file';

export default async function resourceCreateAction(
  // prevState: unknown
  _: unknown,
  formData: FormData,
) {
  const { user } = await validateSession();
  const formParsed = parseWithZod(formData, {
    schema: pluginCreateZod,
  });

  if (formParsed.status !== 'success') {
    return formParsed.reply();
  }

  //DeConstruct fields
  const {
    description,
    subtitle,
    title,
    versionSupport,
    categories,
    linkSource,
    linkSupport,
    tags,
    languages,
    discord,
    resourceType,
    resourceFile,
    resourceUrl,
    releaseVersion,
  } = formParsed.value;

  let fileUrl;
  if (resourceType === 'file') {
    const fileUpload = await uploadThing_File(resourceFile!);
    if (!fileUpload) {
      return;
    }
    fileUrl = fileUpload.url;
  } else {
    fileUrl = resourceUrl!;
  }

  const newPlugin = await resourceCreate({
    title,
    subtitle,
    description,
    versionSupport,
    categories,
    linkSource,
    linkSupport,
    tags,
    languages,
    discord,
    releaseVersion,
    userId: user.id,
    fileUrl,
  });

  await activityAddAction(user.id, ACTIVITY.NEW_RESOURCE, `${newPlugin.id}`);

  // revalidateTag(`tickets-user-${user.id}`);

  redirect(
    '/dashboard/resources?toast-success=true&toast-message=Resource%20successfully%20created&toast-id=create-resource',
  );
}
