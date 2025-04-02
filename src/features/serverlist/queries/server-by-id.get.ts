import { eq, sql } from 'drizzle-orm';

import DTOServer_WithVotes from '@/features/serverlist/dto/server-with-votes.dto';
import { T_DTOServer_Votes } from '@/features/serverlist/types/t-dto-server.type';
import { cacheLife, cacheTag } from '@/lib/cache/cache-exports';
import { db } from '@/lib/db';
import { serverTable, serverVotesTable } from '@/lib/db/schema';

export async function serverGetById(
  serverId: string,
): Promise<T_DTOServer_Votes | undefined> {
  'use cache';
  cacheLife('hours');
  cacheTag(`server-id-${serverId}`);

  const server = await db.query.serverTable.findFirst({
    where: eq(serverTable.id, serverId),
    with: {
      user: true,
    },
    extras: {
      //Get votes as a total, not array of objects
      votes:
        sql<number>`(SELECT count(*) from ${serverVotesTable} WHERE "serverId" = ${serverTable.id})`.as(
          'votes',
        ),
    },
  });

  if (!server) return undefined;
  return DTOServer_WithVotes(server);
}
