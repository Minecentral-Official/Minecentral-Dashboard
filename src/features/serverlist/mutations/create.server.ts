'use server';

import { serverTable } from '@/features/serverlist/schemas/server.table';
import { db } from '@/lib/db';
import createUUID from '@/lib/utils/create-uuid';

export default async function serverCreate({
  title,
  subtitle,
  slug,
  userId,
}: Pick<
  typeof serverTable.$inferInsert,
  'title' | 'subtitle' | 'slug' | 'userId'
>) {
  const newServer = await db.transaction(async (tx) => {
    //Insert new plugin info
    const newServer = await tx
      .insert(serverTable)
      .values({
        id: createUUID(),
        title,
        subtitle,
        slug,
        userId,
      })
      .returning();

    return newServer[0];
  });

  return newServer;
}
