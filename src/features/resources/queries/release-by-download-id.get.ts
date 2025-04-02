import { eq } from 'drizzle-orm';

import { cacheLife, cacheTag } from '@/lib/cache/cache-exports';
import { db } from '@/lib/db';
import { resourceReleaseTable } from '@/lib/db/schema';

export default async function resourceGetReleaseByResourceId(id: string) {
  'use cache';
  cacheLife('minutes');
  cacheTag(`release-id-${id}`);
  const release = await db.query.resourceReleaseTable.findFirst({
    where: eq(resourceReleaseTable.pluginId, id),
    with: { plugin: true },
  });
  return release;
}
