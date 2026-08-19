import { desc, eq, sql } from 'drizzle-orm';

import DTOServer_WithVotes from '@/features/serverlist/dto/server-with-votes.dto';
import { T_DTOServer_Votes } from '@/features/serverlist/types/t-dto-server.type';
import { db } from '@/lib/db';
import { serverTable, serverVotesTable } from '@/lib/db/schema';

export async function serverListByUserId(
  userId: string,
): Promise<T_DTOServer_Votes[]> {
  const servers = await db.query.serverTable.findMany({
    where: eq(serverTable.userId, userId),
    with: {
      user: true,
    },
    extras: {
      votes:
        sql<number>`(SELECT count(*) from ${serverVotesTable} WHERE "serverId" = ${serverTable.id})`.as(
          'votes',
        ),
    },
    orderBy: desc(serverTable.updatedAt),
  });

  return servers.map(DTOServer_WithVotes);
}
