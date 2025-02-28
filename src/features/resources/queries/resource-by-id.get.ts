import { desc, eq } from 'drizzle-orm';

import DTOResource_WithReleases from '@/features/resources/dto/plugin.dto';
import { cacheLife, cacheTag } from '@/lib/cache/cache-exports';
import { db } from '@/lib/db';
import { resourceReleaseTable, resourceTable } from '@/lib/db/schema';

export async function resourceGetById(resourceId: string) {
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
  return DTOResource_WithReleases(resource);
}
