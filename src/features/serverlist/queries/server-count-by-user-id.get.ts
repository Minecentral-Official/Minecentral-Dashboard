import { count, eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { serverTable } from '@/lib/db/schema';

export async function serverCountByUserId(userId: string) {
  const result = await db
    .select({ count: count() })
    .from(serverTable)
    .where(eq(serverTable.userId, userId));

  return result[0]?.count ?? 0;
}
