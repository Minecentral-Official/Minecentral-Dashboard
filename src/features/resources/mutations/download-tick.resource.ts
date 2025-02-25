import { eq, sql } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';

import { resourceTable } from '@/features/resources/schemas/resource.table';
import { db } from '@/lib/db';

export default async function resourceDownloadTick(resourceId: number) {
  revalidateTag(`resource-id-${resourceId}`);
  return await db
    .update(resourceTable)
    .set({ downloads: sql`${resourceTable.downloads} + 1` })
    .where(eq(resourceTable.id, resourceId));
}
