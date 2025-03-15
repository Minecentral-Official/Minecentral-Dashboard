'use server';

import { resourceTable } from '@/features/resources/schemas/resource.table';
import { db } from '@/lib/db';
import createUUID from '@/lib/utils/create-uuid';

export default async function projectCreate({
  title,
  subtitle,
  slug,
  type,
  userId,
}: Pick<
  typeof resourceTable.$inferInsert,
  'title' | 'subtitle' | 'slug' | 'type' | 'userId'
>) {
  const newResource = await db.transaction(async (tx) => {
    //Insert new plugin info
    const newPlugin = await tx
      .insert(resourceTable)
      .values({
        id: createUUID(),
        type,
        title,
        subtitle,
        slug,
        userId,
      })
      .returning();

    return newPlugin[0];
  });

  return newResource;
}
