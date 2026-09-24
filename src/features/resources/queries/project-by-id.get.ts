import 'server-only';

import { desc, eq, sql } from 'drizzle-orm';

import DTOResource_WithReleases from '@/features/resources/dto/plugin.dto';
import getSession from '@/lib/auth/helpers/get-session';
import { canAccessOwnedRecord } from '@/lib/auth/helpers/permissions';
import { cacheLife, cacheTag } from '@/lib/cache/cache-exports';
import { db } from '@/lib/db';
import {
  likedResourceTable,
  resourceReleaseTable,
  resourceTable,
} from '@/lib/db/schema';

export async function projectGetById(resourceId: string) {
  const resource = await cachedProject(resourceId);
  if (!resource || resource.status === 'accepted') return resource;
  const session = await getSession();
  if (
    !session ||
    !canAccessOwnedRecord(
      session.user,
      resource.author.id,
      'resources:moderate',
    )
  )
    return undefined;
  return resource;
}
async function cachedProject(resourceId: string) {
  'use cache';
  cacheLife('hours');
  cacheTag(`resource-id-${resourceId}`);

  const resource = await db.query.resourceTable.findFirst({
    where: eq(resourceTable.id, resourceId),
    extras: {
      likes:
        sql<number>`(SELECT count(*) from ${likedResourceTable} WHERE "resource_id" = ${resourceTable.id})`.as(
          'likes',
        ),
      downloads:
        sql<number>`(SELECT count(*) FROM ${resourceReleaseTable} WHERE "pluginId" = ${resourceTable.id})`.as(
          'downloads',
        ),
    },
    with: {
      user: true,
      releases: {
        orderBy: desc(resourceReleaseTable.createdAt),
      },
    },

    // sql<number>`(SELECT count(*) from ${likedResourceTable} WHERE ${likedResourceTable.resourceId} = ${sql.placeholder('resourceId')})`.as(
    //   'likes',
    // ),
  });

  if (!resource) return undefined;
  return DTOResource_WithReleases(resource);
}
