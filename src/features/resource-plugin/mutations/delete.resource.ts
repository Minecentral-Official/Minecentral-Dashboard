import { eq } from 'drizzle-orm';

import { pluginTable } from '@/features/resource-plugin/schemas/plugin.table';
import { db } from '@/lib/db';

export default async function resourceDelete(resourceId: number) {
  return await db.delete(pluginTable).where(eq(pluginTable.id, resourceId));
}
