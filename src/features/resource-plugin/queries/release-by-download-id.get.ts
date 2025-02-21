import { eq } from 'drizzle-orm';

import { cacheLife, cacheTag } from '@/lib/cache/cache-exports';
import { db } from '@/lib/db';
import { pluginReleaseTable } from '@/lib/db/schema';

export default async function releaseGetByDownloadId(downloadId: string) {
  'use cache';
  cacheLife('minutes');
  cacheTag(`release-id-${downloadId}`);
  const release = await db.query.pluginReleaseTable.findFirst({
    where: eq(pluginReleaseTable.downloadId, downloadId),
  });
  return release;
}
