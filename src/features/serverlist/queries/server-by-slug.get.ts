import { eq, sql } from 'drizzle-orm';

import DTOServer_WithVotifier from '@/features/serverlist/dto/server-with-votifier.dto';
import { cacheLife, cacheTag } from '@/lib/cache/cache-exports';
import { db } from '@/lib/db';
import { serverTable, serverVotesTable } from '@/lib/db/schema';
import lower from '@/lib/db/utils/lower';

export async function serverGetBySlug(slug: string, publicOnly = false) {
  'use cache';
  cacheLife('hours');
  cacheTag(`server-slug-${slug}`);

  const server = await db.query.serverTable.findFirst({
    where: eq(lower(serverTable.slug), slug.toLowerCase()),
    with: {
      user: true,
      votifier: true,
    },
    extras: {
      votes:
        sql<number>`(SELECT count(*) from ${serverVotesTable} WHERE "serverId" = ${serverTable.id})`.as(
          'votes',
        ),
    },
  });

  if (!server) return undefined;
  if (publicOnly && server.status !== 'published') return undefined;

  return DTOServer_WithVotifier(server);
}
