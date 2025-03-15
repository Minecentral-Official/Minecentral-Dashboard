'use server';

import { eq, sql } from 'drizzle-orm';

import { db } from '@/lib/db';
import { resourceReleaseTable } from '@/lib/db/schema';

export default async function resourceDownloadTick(releaseId: string) {
  // revalidateTag(`resource-id-${resourceId}`);
  return await db
    .update(resourceReleaseTable)
    .set({ downloads: sql`${resourceReleaseTable.downloads} + 1` })
    .where(eq(resourceReleaseTable.id, releaseId));
}
