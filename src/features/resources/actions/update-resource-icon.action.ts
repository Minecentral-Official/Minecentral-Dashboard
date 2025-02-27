'use server';

import { parseWithZod } from '@conform-to/zod';

import projectUpdate from '@/features/resources/mutations/update.project';
import { resourceUpdateGeneralZod } from '@/features/resources/schemas/zod/update-general.zod';
import validateSession from '@/lib/auth/helpers/validate-session';

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
  const { resourceId, slug, subtitle, title } = formParsed.value;

  await projectUpdate(resourceId, {
    slug,
    subtitle,
    title,
  });

  // revalidateTag(`tickets-user-${user.id}`);
  return;
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
