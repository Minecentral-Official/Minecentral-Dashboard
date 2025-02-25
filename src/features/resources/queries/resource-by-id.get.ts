import { desc, eq, sql } from 'drizzle-orm';

import DTOResourcePlugin from '@/features/resources/dto/plugin.dto';
import resourceIsLikedByUserId from '@/features/resources/queries/resource-is-liked-by-user-id.get';
import { resourceTable } from '@/features/resources/schemas/resource.table';
import { cacheLife, cacheTag } from '@/lib/cache/cache-exports';
import { db } from '@/lib/db';
import { likedResourceTable, resourceReleaseTable } from '@/lib/db/schema';

export default async function resourceGetById(
  resourceId: number,
  userId?: string,
) {
  const resource = await getResource(resourceId);
  if (!resource) return undefined;

  // Fetch like count (uncached) separately
  const likeCount = await getLikeCount(resourceId);

  // Fetch user-specific like status (uncached)
  let liked = false;
  if (userId) {
    liked = await resourceIsLikedByUserId(resourceId, userId);
  }

  return { ...resource, likeCount, liked };
}

// Caching for the resource details
async function getResource(resourceId: number) {
  'use cache';
  cacheLife('hours');
  cacheTag(`resource-id-${resourceId}`);

  const resource = await db.query.resourceTable.findFirst({
    where: eq(resourceTable.id, resourceId),
    with: {
      user: true,
      releases: {
        orderBy: desc(resourceReleaseTable.createdAt),
      },
    },
  });

  if (!resource) return undefined;
  return DTOResourcePlugin(resource);
}

// Get the number of likes (no cache)
async function getLikeCount(resourceId: number) {
  const count = await db
    .select({ count: sql<number>`count(*)` })
    .from(likedResourceTable)
    .where(eq(likedResourceTable.resourceId, resourceId))
    .execute();

  return count[0]?.count ?? 0;
}

// export default async function resourceGetById(resourceId: number) {
//   'use cache';
//   cacheLife('hours');
//   cacheTag(`resource-id-${resourceId}`);
//   const resource = await db.query.resourceTable.findFirst({
//     where: eq(resourceTable.id, resourceId),
//     with: {
//       user: true,
//       releases: {
//         orderBy: desc(resourceReleaseTable.createdAt),
//       },
//       likes: true,
//     },
//   });
//   if (!resource) return undefined;
//   return DTOResourcePlugin(resource);
// }
