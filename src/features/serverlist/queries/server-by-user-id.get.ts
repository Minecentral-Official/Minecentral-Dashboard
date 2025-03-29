import { eq } from 'drizzle-orm';

import { serverGetById } from '@/features/serverlist/queries/server-by-id.get';
import { T_DTOServer } from '@/features/serverlist/types/t-dto-server.type';
import { db } from '@/lib/db';
import { serverTable } from '@/lib/db/schema';

export async function serverGetByUserId(
  userId: string,
): Promise<T_DTOServer | undefined> {
  const serverId = await db.query.serverTable.findFirst({
    where: eq(serverTable.userId, userId),
  });

  if (!serverId) return undefined;
  const server = await serverGetById(serverId.id);

  if (!server) return undefined;
  return server; //Already dto'd
}
