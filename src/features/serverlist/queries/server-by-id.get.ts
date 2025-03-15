import { eq } from 'drizzle-orm';

import { cacheLife, cacheTag } from '@/lib/cache/cache-exports';
import { db } from '@/lib/db';
import { serverTable } from '@/lib/db/schema';

export async function serverGetById(serverId: string) {
  'use cache';
  cacheLife('hours');
  cacheTag(`server-id-${serverId}`);

  const server = await db.query.serverTable.findFirst({
    where: eq(serverTable.id, serverId),
    with: {
      user: true,
      votes: true,
    },
  });

  return server;
}
