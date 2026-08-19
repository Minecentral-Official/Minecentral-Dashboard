import { and, eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { serverTable } from '@/lib/db/schema';
import lower from '@/lib/db/utils/lower';

export default async function serverAddressAvailable(
  ip: string,
  port: number,
  ignoreServerId?: string,
) {
  const server = await db.query.serverTable.findFirst({
    where: and(
      eq(lower(serverTable.ip), ip.toLowerCase()),
      eq(serverTable.port, port),
    ),
  });

  if (!server) return true;
  return server.id === ignoreServerId;
}
