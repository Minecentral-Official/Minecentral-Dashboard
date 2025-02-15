import { eq } from 'drizzle-orm';

import DTOResourcePlugin from '@/features/resource-plugin/dto/plugin.dto';
import { pluginTable } from '@/features/resource-plugin/schemas/plugin.table';
import { db } from '@/lib/db';

export default async function resourceGetById(resourceId: number) {
  const resource = await db.query.pluginTable.findFirst({
    where: eq(pluginTable.id, resourceId),
    with: { user: true },
  });
  if (!resource) return null;
  return DTOResourcePlugin(resource);
}
