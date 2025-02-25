import { and, eq } from 'drizzle-orm';

import { cacheLife, cacheTag } from '@/lib/cache/cache-exports';
import { db } from '@/lib/db';
import { likedResourceTable } from '@/lib/db/schema';

// Check if the resource is liked by the user
export default async function resourceIsLikedByUserId(
  resourceId: number,
  userId: string,
): Promise<boolean> {
  'use cache';
  cacheLife('hours');
  cacheTag(`resource-like-${resourceId}-${userId}`);
  const like = await db.query.likedResourceTable.findFirst({
    where: and(
      eq(likedResourceTable.userId, userId),
      eq(likedResourceTable.resourceId, resourceId),
    ),
  });

  return !!like; // Returns true if liked, false otherwise
}
