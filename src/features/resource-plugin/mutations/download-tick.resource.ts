import { eq, sql } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';

import { pluginTable } from '@/features/resource-plugin/schemas/plugin.table';
import { db } from '@/lib/db';

export default async function resourceDownloadTick(resourceId: number) {
  revalidateTag(`resource-id-${resourceId}`);
  return await db
    .update(pluginTable)
    .set({ downloads: sql`${pluginTable.downloads} + 1` })
    .where(eq(pluginTable.id, resourceId));
}
