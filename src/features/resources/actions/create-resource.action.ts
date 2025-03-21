'use server';

import { parseWithZod } from '@conform-to/zod';
import { redirect } from 'next/navigation';

import projectCreate from '@/features/resources/mutations/create.project';
import { projectGetIdBySlug } from '@/features/resources/queries/resource-get-id-by-slug.get';
import { S_ProjectCreate } from '@/features/resources/schemas/zod/s-project-create.zod';
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
    schema: S_ProjectCreate,
  });

  if (formParsed.status !== 'success') {
    console.log(formParsed.error);
    return { success: false, message: 'Invalid form data!' };
  }
  //DeConstruct fields
  const { title, subtitle, slug, type } = formParsed.value;

  const resourceOnSlug = await projectGetIdBySlug(slug);

  if (resourceOnSlug !== undefined) {
    return { success: false, message: `The slug '${slug}' is already taken!` };
  }

  let newPlugin;
  try {
    newPlugin = await projectCreate({
      title,
      subtitle,
      slug,
      type,
      userId: user.id,
    });
    await activityAddAction(user.id, ACTIVITY.RESOURCE_NEW, `${newPlugin.id}`);
  } catch (e) {
    console.log('Error while creating a new resource!', e);
    return {
      success: false,
      message: 'An error occured, please try again later!',
    };
  }
  redirect(
    `/dashboard/resources/${newPlugin.slug}?toast-success=true&toast-message=Resource%20successfully%20created&toast-id=create-resource`,
  );
}
