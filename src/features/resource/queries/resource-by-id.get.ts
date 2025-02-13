import { eq } from 'drizzle-orm';

import { resourceTable } from '@/features/resource/schemas/resource.table';
import { db } from '@/lib/db';

export default async function resourceGetById(resourceId: number) {
  return await db.query.resource.findFirst({
    where: eq(resourceTable.id, resourceId),
  });
}
