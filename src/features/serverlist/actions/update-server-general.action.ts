'use server';

import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

import serverUpdate from '@/features/serverlist/mutations/update.server';
import serverAddressAvailable from '@/features/serverlist/queries/server-address-available.boolean';
import { serverGetById } from '@/features/serverlist/queries/server-by-id.get';
import serverSlugAvailable from '@/features/serverlist/queries/server-slug-available.boolean';
import userCanEditServer from '@/features/serverlist/queries/user-can-edit-server.boolean';
import { S_ServerUpdateGeneral } from '@/features/serverlist/schemas/zod/s-server-update-general.zod';
import {
  serverIsPublicReady,
  serverMissingRequiredFields,
} from '@/features/serverlist/util/server-public-ready';
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

  if (!(await userCanEditServer(serverId)))
    return { success: false, message: 'You are not allowed to edit this listing.' };

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

  if (!(await serverAddressAvailable(data.ip, data.port, serverId)))
    return {
      success: false,
      message: 'That server address is already listed.',
    };

  const nextData = {
    title: data.title,
    slug: data.slug,
    ip: data.ip,
    port: data.port,
    description: data.description ?? null,
    categories: data.categories ?? null,
    platforms: data.platforms ?? null,
    iconUrl: deletingIcon ? null : (server?.iconUrl ?? null),
  };

  const updatedServer = await serverUpdate(serverId, {
    title: data.title,
    slug: data.slug,
    ip: data.ip,
    port: data.port,
    description: data.description || null,
    categories: data.categories ?? [],
    platforms: data.platforms ?? [],
    linkDiscord: data.linkDiscord || null,
    iconUrl: deletingIcon ? null : undefined,
    status:
      server?.status === 'published' && !serverIsPublicReady(nextData) ?
        'draft'
      : undefined,
  });
  const missing = serverMissingRequiredFields(nextData);
  //Redirect to is optional due to SLUG might not update every time we update the project
  // Redirect ONLY if slug changes, if slug doesnt change and we redirect, the client doesn't refresh search params
  if (!redirectTo) {
    return {
      success: true,
      message:
        missing.length > 0 && server?.status === 'published' ?
          'Server updated and moved back to draft.'
        : 'Server updated successfully!',
    };
  } else {
    redirect(
      `/dashboard/servers/${updatedServer.slug}?toast-success=true&toast-message=Project%20updated%20successfully&toast-id=update-realm`,
    );
  }
}
