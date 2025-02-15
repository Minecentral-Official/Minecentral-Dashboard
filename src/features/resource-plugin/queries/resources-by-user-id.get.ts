import { eq } from 'drizzle-orm';

import DTOResourcePlugin from '@/features/resource-plugin/dto/plugin.dto';
import { pluginTable } from '@/features/resource-plugin/schemas/plugin.table';
import { db } from '@/lib/db';

export default async function resourcesGetByUserId(userId: string) {
  const plugins = await db.query.pluginTable.findMany({
    where: eq(pluginTable.userId, userId),
    with: { user: true },
  });

  return plugins.map((plugin) => DTOResourcePlugin(plugin));
}
