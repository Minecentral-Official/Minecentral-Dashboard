import { eq, sql } from 'drizzle-orm';

import { resourceGetById } from '@/features/resources/queries/resource-by-id.get';
import resourceIsLikedByUserId from '@/features/resources/queries/resource-is-liked-by-user-id.get';
import { db } from '@/lib/db';
import { likedResourceTable } from '@/lib/db/schema';

export default async function resourceGetById_WithUser(
  resourceId: string,
  userId?: string,
) {
  const resource = await resourceGetById(resourceId);
  if (!resource) return undefined;

  // Fetch like count (cached) separately
  const likeCount = await getLikeCount(resourceId);

  // Fetch user-specific like status (uncached)
  let liked = false;
  if (userId) {
    liked = await resourceIsLikedByUserId(resourceId, userId);
  }

  return { ...resource, likeCount, liked };
}

// Get the number of likes (no cache)
async function getLikeCount(resourceId: string) {
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
