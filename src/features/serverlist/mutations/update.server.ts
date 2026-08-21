'use server';

import { eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';

import { serverTable } from '@/features/serverlist/schemas/server.table';
import { revalidateTagInternal } from '@/lib/cache/revalidate-tag';
import { db } from '@/lib/db';

export default async function serverUpdate(
  serverId: string,
  values: Partial<typeof serverTable.$inferInsert>,
) {
  const cleanValues = Object.fromEntries(
    Object.entries(values).filter(([, value]) => value !== undefined),
  ) as Partial<typeof serverTable.$inferInsert>;

  const existingServer = await db.query.serverTable.findFirst({
    columns: {
      slug: true,
    },
    where: eq(serverTable.id, serverId),
  });

  const updated = (
    await db
      .update(serverTable)
      .set({ ...cleanValues, updatedAt: new Date() })
      .where(eq(serverTable.id, serverId))
      .returning()
  )[0];

  revalidateTag(`server-id-${serverId}`);
  revalidateTag('server-list');
  if (existingServer?.slug) revalidateTag(`server-slug-${existingServer.slug}`);
  if (updated?.slug && updated.slug !== existingServer?.slug) {
    revalidateTag(`server-slug-${updated.slug}`);
  }

  await Promise.allSettled([
    revalidateTagInternal(`server-id-${serverId}`),
    revalidateTagInternal('server-list'),
    ...(existingServer?.slug ?
      [revalidateTagInternal(`server-slug-${existingServer.slug}`)]
    : []),
    ...(updated?.slug && updated.slug !== existingServer?.slug ?
      [revalidateTagInternal(`server-slug-${updated.slug}`)]
    : []),
  ]);

  return updated;
}
