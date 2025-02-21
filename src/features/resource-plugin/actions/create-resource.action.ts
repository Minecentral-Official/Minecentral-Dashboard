'use server';

import { parseWithZod } from '@conform-to/zod';
import { redirect } from 'next/navigation';
import { UTApi } from 'uploadthing/server';

import resourceCreate from '@/features/resource-plugin/mutations/create.resource';
import { pluginCreateZod } from '@/features/resource-plugin/schemas/zod/create-plugin.zod';
import {
  ACTIVITY,
  activityAddAction,
} from '@/lib/activity/mutations/activity.add';
import validateSession from '@/lib/auth/helpers/validate-session';

const utapi = new UTApi();

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
    releaseFile,
    releaseVersion,
  } = formParsed.value;

  const file = await uploadFile(releaseFile);
  if (!file) {
    return;
  }

  const newPlugin = await resourceCreate({
    data: {
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
      releaseFile: file,
      releaseVersion,
    },
    userId: user.id,
  });

  await activityAddAction(user.id, ACTIVITY.NEW_RESOURCE, `${newPlugin.id}`);

  // revalidateTag(`tickets-user-${user.id}`);

  redirect(
    '/dashboard/resources?toast-success=true&toast-message=Resource%20successfully%20created&toast-id=create-resource',
  );
}

async function uploadFile(file: File) {
  try {
    // Upload file to UploadThing
    const { data, error } = await utapi.uploadFiles(file);

    if (error) {
      return null;
    }

    return data.url;
  } catch (error) {
    console.error('Error uploading file:', error);
    return null;
  }
}
