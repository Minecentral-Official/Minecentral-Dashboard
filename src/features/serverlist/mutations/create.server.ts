'use server';

import { serverTable } from '@/features/serverlist/schemas/server.table';
import { db } from '@/lib/db';
import createUUID from '@/lib/utils/create-uuid';

export default async function serverCreate({
  title,
  slug,
  userId,
  ip,
  port,
}: Pick<
  typeof serverTable.$inferInsert,
  'title' | 'slug' | 'userId' | 'ip' | 'port'
>) {
  const newServer = await db.transaction(async (tx) => {
    //Insert new plugin info
    const newServer = await tx
      .insert(serverTable)
      .values({
        id: createUUID(),
        title,
        slug,
        userId,
        ip,
        port,
      })
      .returning();

    return newServer[0];
  });

  return newServer;
}
