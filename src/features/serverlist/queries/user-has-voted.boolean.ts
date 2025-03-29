import { and, eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { serverVotesTable } from '@/lib/db/schema';

export async function serverUserHasVoted(serverId: string, userId: string) {
  const recentVote = await db.query.serverVotesTable.findFirst({
    where: and(
      eq(serverVotesTable.userId, userId),
      eq(serverVotesTable.serverId, serverId),
    ),
  });
  if (!recentVote) {
    return false;
  }
  //Returns if voted over 24 hours ago (23 to make it lenient)
  return (Date.now() - recentVote.voteTime.getTime()) / (1000 * 60 * 60) >= 23;
}
