import { eq } from 'drizzle-orm';

import DTOResourcePlugin from '@/features/resource/dto/plugin.dto';
import { resourceTable } from '@/features/resource/schemas/resource.table';
import { db } from '@/lib/db';

export default async function resourcesGetByUserId(userId: string) {
  const plugins = await db.query.resourceTable.findMany({
    where: eq(resourceTable.userId, userId),
    with: { user: true },
  });

  return plugins.map((plugin) => DTOResourcePlugin(plugin));
}
