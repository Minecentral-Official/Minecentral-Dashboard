'use server';

import { parseWithZod } from '@conform-to/zod';

import projectUpdate from '@/features/resources/mutations/update.project';
import { redirect } from 'next/navigation';
import resourceCanEdit from '../queries/user-can-edit-resource.boolean';
import { projectUpdateZod_Action } from '../schemas/zod/resource-actions.zod';


export default async function projectUpdateAction (
  _: unknown,
  formData: FormData
) {
  
  const formParsed = parseWithZod(formData, {
    schema: projectUpdateZod_Action,
  });

  if (formParsed.status !== 'success') {
    console.log(formParsed.error)
    return formParsed.reply();
  }

  //DeConstruct fields
  const {id: resourceId, urlTab} = formParsed.value;

  //Check permissions
  if (!(await resourceCanEdit(resourceId))) return redirect(
        `/dashboard/resources/${resourceId}/${urlTab || ""}?toast-success=false&toast-message=Cannot%20edit%20resource&toast-id=update-resource`,
      );

  const updatedResource = await projectUpdate(resourceId, {...formParsed.value});

  redirect(
    `/dashboard/resources/${updatedResource.slug}/${urlTab || ""}?toast-success=true&toast-message=Project%20updated%20successfully&toast-id=update-resource`,
  );
}
