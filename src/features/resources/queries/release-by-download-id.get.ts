import { eq } from 'drizzle-orm';

import { cacheLife, cacheTag } from '@/lib/cache/cache-exports';
import { db } from '@/lib/db';
import { resourceReleaseTable } from '@/lib/db/schema';

export default async function resourceGetReleaseByDownloadId(
  downloadId: string,
) {
  'use cache';
  cacheLife('minutes');
  cacheTag(`release-id-${downloadId}`);
  const release = await db.query.resourceReleaseTable.findFirst({
    where: eq(resourceReleaseTable.downloadId, downloadId),
    with: { plugin: true },
  });
  return release;
}
