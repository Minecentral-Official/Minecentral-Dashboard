import { eq, sql } from 'drizzle-orm';

import { projectGetById } from '@/features/resources/queries/project-by-id.get';
import resourceIsLikedByUserId from '@/features/resources/queries/resource-is-liked-by-user-id.get';
import { db } from '@/lib/db';
import { likedResourceTable } from '@/lib/db/schema';

export async function projectGetById_WithUser(
  resourceId: string,
  userId?: string,
) {
  const resource = await projectGetById(resourceId);
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
