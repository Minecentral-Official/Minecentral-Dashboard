import { eq } from 'drizzle-orm';

import DTOResource_WithReleases from '@/features/resources/dto/plugin.dto';
import { resourceTable } from '@/features/resources/schemas/resource.table';
import { cacheLife } from '@/lib/cache/cache-exports';
import { db } from '@/lib/db';

export default async function resourceListLikedByUserId(userId: string) {
  'use cache';
  cacheLife('hours');
  const plugins = await db.query.resourceTable.findMany({
    where: eq(resourceTable.userId, userId),
    with: { user: true, releases: true, likes: true },
  });

  return plugins.map((plugin) => DTOResource_WithReleases(plugin));
}
