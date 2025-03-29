'use server';

import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

import serverUpdate from '@/features/serverlist/mutations/update.server';
import { serverGetById } from '@/features/serverlist/queries/server-by-id.get';
import serverSlugAvailable from '@/features/serverlist/queries/server-slug-available.boolean';
import { S_ServerUpdateGeneral } from '@/features/serverlist/schemas/zod/s-server-update-general.zod';
import parseFormWithSchema from '@/lib/utils/parse-form-with-schema.util';

export default async function serverUpdateGeneralAction(
  _: unknown,
  formData: FormData,
) {
  const parsedForm = await parseFormWithSchema(formData, S_ServerUpdateGeneral);

  if (parsedForm.status !== 'success') {
    console.log(parsedForm.error);
    return { success: false, message: 'Invalid form data!' };
  }

  const { id: serverId, slug } = parsedForm.value;

  const server = await serverGetById(serverId);

  let redirectTo = undefined;
  //Are we updating the slug?
  if (server && server.slug !== slug) {
    if (!(await serverSlugAvailable(slug))) {
      console.log('Cant set slug to same as another project!');
      return { success: false, message: `Slug ${slug} is already taken!` };
    } else {
      //Re validate the cache for old and new resource slugs
      if (server) revalidateTag(`server-slug-${server.slug}`);
      revalidateTag(`server-slug-${slug}`);
      redirectTo = slug;
    }
  }

  const { deletingIcon, ...data } = parsedForm.value;

  const updatedServer = await serverUpdate(serverId, {
    ...data,
    iconUrl: deletingIcon ? null : undefined,
  });
  //Redirect to is optional due to SLUG might not update every time we update the project
  // Redirect ONLY if slug changes, if slug doesnt change and we redirect, the client doesn't refresh search params
  if (!redirectTo) {
    return {
      success: true,
      message: 'Server updated successfully!',
    };
  } else {
    redirect(
      `/dashboard/servers/${updatedServer.slug}?toast-success=true&toast-message=Project%20updated%20successfully&toast-id=update-realm`,
    );
  }
}
