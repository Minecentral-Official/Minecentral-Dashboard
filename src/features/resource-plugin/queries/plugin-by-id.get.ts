import { desc, eq } from 'drizzle-orm';

import DTOResourcePlugin from '@/features/resource-plugin/dto/plugin.dto';
import { pluginTable } from '@/features/resource-plugin/schemas/plugin.table';
import { cacheLife, cacheTag } from '@/lib/cache/cache-exports';
import { db } from '@/lib/db';
import { pluginReleaseTable } from '@/lib/db/schema';

export default async function pluginGetById(resourceId: number) {
  'use cache';
  cacheLife('minutes');
  cacheTag(`resource-id-${resourceId}`);
  const resource = await db.query.pluginTable.findFirst({
    where: eq(pluginTable.id, resourceId),
    with: {
      user: true,
      releases: {
        orderBy: desc(pluginReleaseTable.createdAt),
      },
    },
  });
  if (!resource) return undefined;
  return DTOResourcePlugin(resource);
}
