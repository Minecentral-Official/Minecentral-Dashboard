import 'server-only';

import { eq } from 'drizzle-orm';

import { resourceTable } from '@/features/resources/schemas/resource.table';
import { invalidateTag as revalidateTag } from '@/lib/cache/invalidate-tag';
import { db } from '@/lib/db';

export default async function resourceUploadImage(
  resourceId: string,
  iconUrl: string,
) {
  revalidateTag(`resource-id-${resourceId}`);
  return await db
    .update(resourceTable)
    .set({ iconUrl })
    .where(eq(resourceTable.id, resourceId))
    .returning();
}
