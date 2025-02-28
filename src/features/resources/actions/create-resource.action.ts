'use server';

import { parseWithZod } from '@conform-to/zod';
import { redirect } from 'next/navigation';

import projectCreate from '@/features/resources/mutations/create.project';
import { projectCreateZod } from '@/features/resources/schemas/zod/project-create.zod';
import {
  ACTIVITY,
  activityAddAction,
} from '@/lib/activity/mutations/activity.add';
import validateSession from '@/lib/auth/helpers/validate-session';

export default async function resourceCreateAction(
  // prevState: unknown
  _: unknown,
  formData: FormData,
) {
  const { user } = await validateSession();
  const formParsed = parseWithZod(formData, {
    schema: projectCreateZod,
  });

  if (formParsed.status !== 'success') {
    console.log(formParsed.error);
    return { success: false, message: 'Invalid form data!' };
  }
  //DeConstruct fields
  const { title, subtitle, slug, type } = formParsed.value;

  // let fileUrl;
  // if (resourceType === 'file') {
  //   const fileUpload = await uploadThing_File(resourceFile!);
  //   if (!fileUpload) {
  //     return;
  //   }
  //   fileUrl = fileUpload.ufsUrl;
  // } else {
  //   fileUrl = resourceUrl!;
  // }

  const newPlugin = await projectCreate({
    title,
    subtitle,
    slug,
    type,
    userId: user.id,
  });

  await activityAddAction(user.id, ACTIVITY.NEW_RESOURCE, `${newPlugin.id}`);

  // revalidateTag(`tickets-user-${user.id}`);

  redirect(
    '/dashboard/resources?toast-success=true&toast-message=Resource%20successfully%20created&toast-id=create-resource',
  );
}
