import { eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';

import { db } from '@/lib/db';
import { serverTable } from '../schemas/server.table';

export default async function serverUpdate(
  serverId: string,
  values: Partial<typeof serverTable.$inferInsert>,
) {
  const updated = (
    await db
      .update(serverTable)
      .set(values)
      .where(eq(serverTable.id, serverId))
      .returning()
  )[0];

  revalidateTag(`server-id-${serverId}`);
  return updated;
}
