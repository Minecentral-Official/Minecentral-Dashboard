import { eq } from 'drizzle-orm';

import DTOResourcePlugin from '@/features/resource/dto/plugin.dto';
import { resourceTable } from '@/features/resource/schemas/resource.table';
import { db } from '@/lib/db';

export default async function resourceGetById(resourceId: number) {
  const resource = await db.query.resourceTable.findFirst({
    where: eq(resourceTable.id, resourceId),
    with: { user: true },
  });
  if (!resource) return null;
  return DTOResourcePlugin(resource);
}
