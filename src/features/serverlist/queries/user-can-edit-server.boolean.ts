import { eq } from 'drizzle-orm';

import validateSession from '@/lib/auth/helpers/validate-session';
import { db } from '@/lib/db';
import { serverTable } from '@/lib/db/schema';

export default async function userCanEditServer(serverId: string) {
  const { user } = await validateSession();
  const server = await db.query.serverTable.findFirst({
    columns: {
      userId: true,
    },
    where: eq(serverTable.id, serverId),
  });

  return server?.userId === user.id;
}
