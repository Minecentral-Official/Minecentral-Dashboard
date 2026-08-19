'use server';

import { eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';

import { db } from '@/lib/db';
import { serverTable } from '@/lib/db/schema';

export default async function serverDelete(serverId: string) {
  const deleted = (
    await db.delete(serverTable).where(eq(serverTable.id, serverId)).returning()
  )[0];

  revalidateTag('server-list');
  revalidateTag(`server-id-${serverId}`);
  if (deleted?.slug) revalidateTag(`server-slug-${deleted.slug}`);

  return deleted;
}
