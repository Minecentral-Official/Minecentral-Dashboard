'use server';

import { parseWithZod } from '@conform-to/zod';

import projectUpdate from '@/features/resources/mutations/update.project';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import resourceCanEdit from '../queries/user-can-edit-resource.boolean';
import { projectUpdateZod_Base } from '../schemas/zod/resource-base.zod';


export default async function projectUpdateAction<T extends Partial<z.infer<typeof projectUpdateZod_Base>>> (
  // prevState: unknown
  _: unknown,
  formData: FormData,
  schema: z.ZodType<T>
) {
  
  const formParsed = parseWithZod(formData, {
    schema,
  });

  if (formParsed.status !== 'success') {
    return formParsed.reply();
  }

  //DeConstruct fields
  const resourceId = formParsed.value.id!;

  //Check permissions
  if (!(await resourceCanEdit(resourceId))) return redirect(
        `/dashboard/resources?toast-success=false&toast-message=Cannot%20edit%20resource&toast-id=resource-update`,
      );

  const updatedResource = await projectUpdate(resourceId, {...formParsed.value});

  redirect(
    `/dashboard/resources/${updatedResource.slug}?toast-success=true&toast-message=Project%20updated%20successfully&toast-id=resource-update`,
  );
}
