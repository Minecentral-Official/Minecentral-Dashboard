'use server';

import { revalidateTag } from 'next/cache';

import projectUpdate from '@/features/resources/mutations/update.project';
import projectCanEdit from '@/features/resources/queries/user-can-edit-resource.boolean';
import { S_ProjectUpdateLinks } from '@/features/resources/schemas/zod/s-project-update-links.zod';
import parseFormWithSchema from '@/lib/utils/parse-form-with-schema.util';

export default async function projectUpdateLinksAction(
  _: unknown,
  formData: FormData,
) {
  const parsedForm = await parseFormWithSchema(formData, S_ProjectUpdateLinks);

  if (parsedForm.status !== 'success') {
    return { success: false, message: 'Invalid form data!' };
  }

  const { id: resourceId } = parsedForm.value;

  if (!(await projectCanEdit(resourceId))) {
    return { success: false, message: 'No Permission' };
  }

  const updatedResource = await projectUpdate(resourceId, {
    ...parsedForm.value,
  });

  revalidateTag(`resource-id-${updatedResource.id}`);
  return {
    success: true,
    message: 'Project updated successfully!',
  };
}
