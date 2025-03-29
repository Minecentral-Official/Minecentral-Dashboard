import { eq, sql } from 'drizzle-orm';

import DTOServer from '@/features/serverlist/dto/server-base.dto';
import { T_DTOServer } from '@/features/serverlist/types/t-dto-server.type';
import { db } from '@/lib/db';
import { serverTable, serverVotesTable } from '@/lib/db/schema';

export async function serverGetById(
  serverId: string,
): Promise<T_DTOServer | undefined> {
  // 'use cache';
  // cacheLife('hours');
  // cacheTag(`server-id-${serverId}`);

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
  return DTOServer(server);
}
