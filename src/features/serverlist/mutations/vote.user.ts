'use server';

import { revalidateTag } from 'next/cache';

import { db } from '@/lib/db';
import { serverVotesTable } from '@/lib/db/schema';

export default async function serverSaveUserVote(
  values: typeof serverVotesTable.$inferInsert,
) {
  const updated = (
    await db.insert(serverVotesTable).values(values).returning()
  )[0];

  revalidateTag('server-list');
  revalidateTag(`server-id-${values.serverId}`);
  return updated;
}
