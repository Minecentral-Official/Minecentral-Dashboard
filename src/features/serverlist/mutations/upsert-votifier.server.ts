'use server';

import { revalidateTag } from 'next/cache';

import serverUpdate from '@/features/serverlist/mutations/update.server';
import { db } from '@/lib/db';
import { serverVotifierTable } from '@/lib/db/schema';

export default async function serverVotifierUpsert({
  serverId,
  enabled,
  ip,
  port,
  publicKey,
  voteCooldownHours,
}: {
  serverId: string;
  enabled: boolean;
  ip?: string;
  port?: number;
  publicKey?: string;
  voteCooldownHours: number;
}) {
  await db
    .insert(serverVotifierTable)
    .values({
      serverId,
      enabled,
      ip: ip || '',
      port,
      publicKey,
    })
    .onConflictDoUpdate({
      target: serverVotifierTable.serverId,
      set: {
        enabled,
        ip: ip || '',
        port,
        publicKey,
      },
    });

  const server = await serverUpdate(serverId, { voteCooldownHours });
  revalidateTag('server-list');
  revalidateTag(`server-id-${serverId}`);
  revalidateTag(`server-slug-${server.slug}`);

  return server;
}
