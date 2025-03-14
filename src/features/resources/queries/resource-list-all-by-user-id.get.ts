import { eq, sql } from 'drizzle-orm';

import DTOResource from '@/features/resources/dto/plugin-basic.dto';
import { resourceTable } from '@/features/resources/schemas/resource.table';
import { db } from '@/lib/db';
import { likedResourceTable, resourceReleaseTable } from '@/lib/db/schema';

export default async function resourceListAllByUserId(userId: string) {
  const plugins = await db.query.resourceTable.findMany({
    where: eq(resourceTable.userId, userId),
    with: { user: true, releases: true },
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
  });

  return plugins.map((plugin) => DTOResource(plugin));
}
