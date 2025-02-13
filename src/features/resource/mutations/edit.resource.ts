import { eq } from 'drizzle-orm';

import { resourceTable } from '@/features/resource/schemas/resource.table';
import { db } from '@/lib/db';

export default async function resourceEdit(
  resourceId: number,
  values: typeof resourceTable.$inferInsert,
) {
  return await db
    .update(resourceTable)
    .set(values)
    .where(eq(resourceTable.id, resourceId));
}
