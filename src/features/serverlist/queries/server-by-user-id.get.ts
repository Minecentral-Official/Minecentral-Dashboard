import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { serverTable } from '@/lib/db/schema';

export async function serverGetByUserId(userId: string) {
  const server = await db.query.serverTable.findFirst({
    where: eq(serverTable.userId, userId),
  });

  return server;
}
