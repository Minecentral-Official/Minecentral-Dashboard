import { eq } from 'drizzle-orm';

import { resourceTable } from '@/features/resource/schemas/resource.table';
import { db } from '@/lib/db';

export default async function resourceDelete(resourceId: number) {
  return await db.delete(resourceTable).where(eq(resourceTable.id, resourceId));
}
