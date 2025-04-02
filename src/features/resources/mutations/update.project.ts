'use server';

import { eq } from 'drizzle-orm';

import { resourceTable } from '@/features/resources/schemas/resource.table';
import { revalidateTagInternal } from '@/lib/cache/revalidate-tag';
import { db } from '@/lib/db';

export default async function projectUpdate(
  resourceId: string,
  values: Partial<typeof resourceTable.$inferInsert>,
) {
  const updated = (
    await db
      .update(resourceTable)
      .set(values)
      .where(eq(resourceTable.id, resourceId))
      .returning()
  )[0];

  await revalidateTagInternal(`resource-id-${resourceId}`);
  //revalidateTag(`resource-id-${resourceId}`);
  return updated;
}
