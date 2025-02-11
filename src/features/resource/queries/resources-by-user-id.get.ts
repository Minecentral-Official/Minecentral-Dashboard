import { eq } from 'drizzle-orm';

import { resource as resourceTable } from '@/features/resource/schemas/resource.table';
import { db } from '@/lib/db';

export default async function resourcesGetByUserId(userId: string) {
  return await db.query.resource.findMany({
    where: eq(resourceTable.userId, userId),
  });
}
