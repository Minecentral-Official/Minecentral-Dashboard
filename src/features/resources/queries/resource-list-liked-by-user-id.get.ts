import { eq, sql } from 'drizzle-orm';

import DTOResource from '@/features/resources/dto/plugin-basic.dto';
import { cacheLife, cacheTag } from '@/lib/cache/cache-exports';
import { db } from '@/lib/db';
import {
  likedResourceTable,
  resourceReleaseTable,
  resourceTable,
} from '@/lib/db/schema';

export default async function resourceListLikedByUserId(userId: string) {
  'use cache';
  cacheLife('hours');
  cacheTag(`like-${userId}`);
  const plugins = await db.query.likedResourceTable.findMany({
    where: eq(likedResourceTable.userId, userId),
    with: {
      resource: {
        with: { user: true },
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
      },
    },
  });

  return plugins.map((plugin) => DTOResource(plugin.resource));
}
