import { eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';

import { pluginTable } from '@/features/resource-plugin/schemas/plugin.table';
import { db } from '@/lib/db';

export default async function resourceEdit(
  resourceId: number,
  values: typeof pluginTable.$inferInsert,
) {
  revalidateTag(`resource-id-${resourceId}`);
  return await db
    .update(pluginTable)
    .set(values)
    .where(eq(pluginTable.id, resourceId));
}
