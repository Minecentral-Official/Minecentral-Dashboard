import { eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';

import { resourceTable } from '@/features/resources/schemas/resource.table';
import { db } from '@/lib/db';

export default async function projectUpdate(
  resourceId: string,
  values: Partial<typeof resourceTable.$inferInsert>,
) {
  revalidateTag(`resource-id-${resourceId}`);
  return await db
    .update(resourceTable)
    .set(values)
    .where(eq(resourceTable.id, resourceId));
}
