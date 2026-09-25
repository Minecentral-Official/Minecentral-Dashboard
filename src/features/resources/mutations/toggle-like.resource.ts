import 'server-only';

import { and, eq } from 'drizzle-orm';

import { invalidateTag as revalidateTag } from '@/lib/cache/invalidate-tag';
import { db } from '@/lib/db';
import { likedResourceTable } from '@/lib/db/schema';

export default async function resourceToggleLike(
  resourceId: string,
  userId: string,
) {
  revalidateTag(`resource-like-${resourceId}-${userId}`);
  return db.transaction(async (tx) => {
    // Step 1: Try inserting the like
    const inserted = await tx
      .insert(likedResourceTable)
      .values({ userId, resourceId })
      .onConflictDoNothing()
      .returning(); // Returns an array with the inserted row if successful

    if (inserted.length === 0) {
      // Step 2: If insertion failed (like already exists), remove it
      await tx
        .delete(likedResourceTable)
        .where(
          and(
            eq(likedResourceTable.userId, userId),
            eq(likedResourceTable.resourceId, resourceId),
          ),
        );

      return false;
    }

    return true;
  });
}
