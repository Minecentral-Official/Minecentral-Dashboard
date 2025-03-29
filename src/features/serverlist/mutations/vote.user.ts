'use server';

import { sql } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';

import { db } from '@/lib/db';
import { serverVotesTable } from '@/lib/db/schema';

export default async function serverSaveUserVote(
  serverId: string,
  userId: string,
) {
  const updated = (
    await db
      .insert(serverVotesTable)
      .values({
        serverId,
        userId,
      })
      .onConflictDoUpdate({
        target: serverVotesTable.serverId,
        set: { voteTime: sql`(CURRENT_TIMESTAMP)` },
      })
      .returning()
  )[0];

  revalidateTag(`server-id-${serverId}`);
  return updated;
}
