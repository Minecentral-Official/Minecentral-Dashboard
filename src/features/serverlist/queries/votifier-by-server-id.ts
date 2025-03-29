'use server';

import { eq } from 'drizzle-orm';

import DTOServer_Votifier from '@/features/serverlist/dto/votifier.dto';
import { db } from '@/lib/db';
import { serverVotifierTable } from '@/lib/db/schema';

export async function serverGetVotifierByServerId(serverId: string) {
  // 'use cache';
  // cacheLife('hours');
  // cacheTag(`server-id-${serverId}`);

  const votifierData = await db.query.serverVotifierTable.findFirst({
    where: eq(serverVotifierTable.serverId, serverId),
  });

  if (!votifierData) return undefined;
  return DTOServer_Votifier(votifierData);
}
