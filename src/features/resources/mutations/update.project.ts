import { eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';
import { z } from 'zod';

import { resourceTable } from '@/features/resources/schemas/resource.table';
import { projectUpdateZod_Action } from '@/features/resources/schemas/zod/resource-actions.zod';
import { db } from '@/lib/db';

export default async function projectUpdate(
  resourceId: string,
  values: z.infer<typeof projectUpdateZod_Action>,
) {
  revalidateTag(`resource-id-${resourceId}`);
  return (
    await db
      .update(resourceTable)
      .set(values)
      .where(eq(resourceTable.id, resourceId))
      .returning()
  )[0];
}
