import { eq } from 'drizzle-orm';

import 'server-only';

import { cacheLife } from 'next/dist/server/use-cache/cache-life';

import validateSession from '@/lib/auth/helpers/validate-session';
import { cacheTag } from '@/lib/cache/cache-exports';
import { db } from '@/lib/db';
import { ticket } from '@/lib/db/schema';

export default async function ticketsGetSingle(ticketId: number) {
  const { user } = await validateSession();

  const ticket = await cachedTicket(ticketId);

  if (ticket?.userId !== user.id && user.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  return ticket;
}
async function cachedTicket(ticketId: number) {
  'use cache';
  cacheLife('hours');
  cacheTag(`ticket-${ticketId}`);
  return await db.query.ticket.findFirst({
    where: eq(ticket.id, ticketId),
    with: {
      // messages: {
      //   with: { user: true },
      //   orderBy: (messages, { desc }) => [desc(messages.createdAt)],
      // },
      user: true,
    },
  });
}
