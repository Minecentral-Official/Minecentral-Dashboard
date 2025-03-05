import { eq } from 'drizzle-orm';

import { resourceTable } from '@/features/resources/schemas/resource.table';
import { db } from '@/lib/db';

export default async function projectDelete(resourceId: string) {
  return await db.delete(resourceTable).where(eq(resourceTable.id, resourceId));
}
