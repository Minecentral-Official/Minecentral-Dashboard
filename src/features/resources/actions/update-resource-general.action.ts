'use server';

import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

import projectUpdate from '@/features/resources/mutations/update.project';
import { projectGetById } from '@/features/resources/queries/project-by-id.get';
import projectSlugAvailable from '@/features/resources/queries/slug-available.boolean';
import projectCanEdit from '@/features/resources/queries/user-can-edit-resource.boolean';
import { S_ProjectUpdateGeneral } from '@/features/resources/schemas/zod/s-project-update-general.zod';
import parseFormWithSchema from '@/lib/utils/parse-form-with-schema.util';

export default async function projectUpdateGeneralAction(
  _: unknown,
  formData: FormData,
) {
  const parsedForm = await parseFormWithSchema(
    formData,
    S_ProjectUpdateGeneral,
  );

  if (parsedForm.status !== 'success') {
    return { success: false, message: 'Invalid form data!' };
  }

  const { id: resourceId, slug } = parsedForm.value;

  if (!(await projectCanEdit(resourceId))) {
    return { success: false, message: 'No Permission' };
  }

  const resource = await projectGetById(resourceId);

  let redirectTo = undefined;
  //Are we updating the slug?
  if (resource && resource.slug !== slug) {
    if (!(await projectSlugAvailable(slug))) {
      console.log('Cant set slug to same as another project!');
      return { success: false, message: `Slug ${slug} is already taken!` };
    } else {
      //Re validate the cache for old and new resource slugs
      if (resource) revalidateTag(`resource-slug-${resource.slug}`);
      revalidateTag(`resource-slug-${slug}`);
      redirectTo = slug;
    }
  }

  const updatedResource = await projectUpdate(resourceId, {
    ...parsedForm.value,
  });

  revalidateTag(`resource-id-${updatedResource.id}`);
  //Redirect to is optional due to SLUG might not update every time we update the project
  // Redirect ONLY if slug changes, if slug doesnt change and we redirect, the client doesn't refresh search params
  if (!redirectTo) {
    return {
      success: true,
      message: 'Project updated successfully!',
    };
  } else {
    redirect(
      `/dashboard/resources/${updatedResource.slug}?toast-success=true&toast-message=Project%20updated%20successfully&toast-id=update-resource`,
    );
  }
}
