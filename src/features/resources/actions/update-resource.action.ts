'use server';

import { parseWithZod } from '@conform-to/zod';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

import projectUpdate from '@/features/resources/mutations/update.project';
import { resourceGetById } from '@/features/resources/queries/resource-by-id.get';
import projectSlugAvailable from '@/features/resources/queries/slug-available.boolean';
import projectCanEdit from '@/features/resources/queries/user-can-edit-resource.boolean';
import { projectDataZod_Base } from '@/features/resources/schemas/zod/project-validation-base.zod';

export default async function projectUpdateAction(
  _: unknown,
  formData: FormData,
) {
  const formParsed = parseWithZod(formData, {
    schema: projectDataZod_Base,
  });

  if (formParsed.status !== 'success') {
    console.log(formParsed.error);
    return { success: false, message: 'Invalid form data!' };
  }

  //DeConstruct fields
  const { id: resourceId, slug } = formParsed.value;

  const resource = (await resourceGetById(resourceId))!;

  //Check permissions
  if (!(await projectCanEdit(resourceId))) {
    return { success: false, message: 'No Permission' };
    // redirect(
    //   `/dashboard/resources/${resource!.slug}/${urlTab || ''}?toast-success=false&toast-message=Cannot%20edit%20resource&toast-id=update-resource`,
    // );
  }

  let redirectTo = undefined;
  if (slug) {
    if (!(await projectSlugAvailable(slug))) {
      console.log('Cant set slug to same as another project!');
      return { success: false, message: `Slug ${slug} is already taken!` };
      // redirect(
      //   `/dashboard/resources/${resource!.slug}/${urlTab || ''}?toast-success=false&toast-message=Project%20url%20${slug}%20is%20already%20taken!&toast-id=update-resource`,
      // );
    } else {
      revalidateTag(`resource-slug-${resource.slug}`);
      revalidateTag(`resource-slug-${slug}`);
      redirectTo = slug;
    }
  }

  const updatedResource = await projectUpdate(resourceId, {
    ...formParsed.value,
  });

  revalidateTag(`resource-id-${updatedResource.id}`);
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
