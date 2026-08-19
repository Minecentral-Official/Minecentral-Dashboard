'use server';

import {
  and,
  arrayOverlaps,
  count,
  desc,
  eq,
  ilike,
  or,
  sql,
} from 'drizzle-orm';

import DTOServer_WithVotifier from '@/features/serverlist/dto/server-with-votifier.dto';
import { T_DTOServer_Votes } from '@/features/serverlist/types/t-dto-server.type';
import { cacheLife, cacheTag } from '@/lib/cache/cache-exports';
import { db } from '@/lib/db';
import { serverTable, serverVotesTable } from '@/lib/db/schema';

import type { T_ServerListFilter } from '@/features/serverlist/schemas/zod/s-server-list-filter.zod';
import type { T_ServerCategory } from '@/features/serverlist/types/t-server-categories.type';
import type { T_ServerLoader } from '@/features/serverlist/types/t-server-loaders.type';

export type T_ServerListResponse = {
  servers: (T_DTOServer_Votes & {
    votifier?: { enabled: boolean; serverId: string };
  })[];
  totalCount: number;
  totalPages: number;
  page: number;
  limit: number;
};

export default async function serverListAllFiltered({
  query,
  categories,
  platforms,
  sort,
  page,
  limit,
}: T_ServerListFilter): Promise<T_ServerListResponse> {
  'use cache';
  cacheLife('minutes');
  cacheTag('server-list');
  cacheTag(
    `server-list-${query ?? ''}-${categories?.join(',') ?? ''}-${platforms?.join(',') ?? ''}-${sort}-${page}-${limit}`,
  );

  const conditions = [
    eq(serverTable.status, 'published'),
    sql`${serverTable.description} IS NOT NULL AND length(trim(${serverTable.description})) > 0`,
    sql`${serverTable.iconUrl} IS NOT NULL`,
    sql`coalesce(array_length(${serverTable.categories}, 1), 0) > 0`,
    sql`coalesce(array_length(${serverTable.platforms}, 1), 0) > 0`,
  ];

  if (query) {
    conditions.push(
      or(
        ilike(serverTable.title, `%${query}%`),
        ilike(serverTable.description, `%${query}%`),
        ilike(serverTable.ip, `%${query}%`),
      )!,
    );
  }

  if (categories && categories.length > 0) {
    conditions.push(
      arrayOverlaps(serverTable.categories, categories as T_ServerCategory[]),
    );
  }

  if (platforms && platforms.length > 0) {
    conditions.push(
      arrayOverlaps(serverTable.platforms, platforms as T_ServerLoader[]),
    );
  }

  const where = and(...conditions);
  const votesSql =
    sql<number>`(SELECT count(*) from ${serverVotesTable} WHERE "serverId" = ${serverTable.id})`;

  const orderBy =
    sort === 'top' ? [desc(votesSql), desc(serverTable.updatedAt)]
    : sort === 'newest' ? [desc(serverTable.createdAt)]
    : [desc(serverTable.updatedAt)];

  const [servers, total] = await Promise.all([
    db.query.serverTable.findMany({
      where,
      with: {
        user: true,
        votifier: true,
      },
      extras: {
        votes: votesSql.as('votes'),
      },
      orderBy,
      limit,
      offset: Math.max(0, page - 1) * limit,
    }),
    db.select({ count: count() }).from(serverTable).where(where),
  ]);

  const totalCount = total[0]?.count ?? 0;

  return {
    servers: servers.map(DTOServer_WithVotifier),
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    page,
    limit,
  };
}
