'use server';

import { revalidateTag } from 'next/cache';

import serverUpdate from '@/features/serverlist/mutations/update.server';
import { serverGetById } from '@/features/serverlist/queries/server-by-id.get';
import userCanEditServer from '@/features/serverlist/queries/user-can-edit-server.boolean';
import {
  serverIsPublicReady,
  serverMissingRequiredFields,
} from '@/features/serverlist/util/server-public-ready';

export async function serverPublishAction(serverId: string) {
  if (!(await userCanEditServer(serverId)))
    return { success: false, message: 'You are not allowed to publish this listing.' };

  const server = await serverGetById(serverId);
  if (!server) return { success: false, message: 'Server listing not found.' };

  if (!serverIsPublicReady(server)) {
    return {
      success: false,
      message: `Complete these fields first: ${serverMissingRequiredFields(server).join(', ')}`,
    };
  }

  const updated = await serverUpdate(serverId, { status: 'published' });
  revalidateTag('server-list');
  revalidateTag(`server-slug-${updated.slug}`);

  return { success: true, message: 'Server listing published.' };
}

export async function serverUnpublishAction(serverId: string) {
  if (!(await userCanEditServer(serverId)))
    return {
      success: false,
      message: 'You are not allowed to unpublish this listing.',
    };

  const updated = await serverUpdate(serverId, { status: 'draft' });
  revalidateTag('server-list');
  revalidateTag(`server-slug-${updated.slug}`);

  return { success: true, message: 'Server listing moved to draft.' };
}
