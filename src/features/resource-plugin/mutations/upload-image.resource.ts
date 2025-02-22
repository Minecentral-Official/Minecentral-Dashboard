import { eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';

import { pluginTable } from '@/features/resource-plugin/schemas/plugin.table';
import { db } from '@/lib/db';

export default async function resourceUploadImage(
  resourceId: number,
  iconUrl: string,
) {
  revalidateTag(`resource-id-${resourceId}`);
  return await db
    .update(pluginTable)
    .set({ iconUrl })
    .where(eq(pluginTable.id, resourceId))
    .returning();
}
