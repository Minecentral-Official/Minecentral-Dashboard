import { eq } from 'drizzle-orm';

import 'server-only';

import { cacheLife } from 'next/dist/server/use-cache/cache-life';

import DTOTicket from '@/features/tickets/dto/ticket.dto';
import validateSession from '@/lib/auth/helpers/validate-session';
import { cacheTag } from '@/lib/cache/cache-exports';
import { db } from '@/lib/db';
import { ticket as ticketTable } from '@/lib/db/schema';

export default async function ticketsGetSingle(ticketId: number) {
  const { user } = await validateSession();

  const ticket = await cachedTicket(ticketId);

  if (ticket?.author.id !== user.id && user.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  return ticket;
}
async function cachedTicket(ticketId: number) {
  'use cache';
  cacheLife('hours');
  cacheTag(`ticket-${ticketId}`);
  const ticket = await db.query.ticket.findFirst({
    where: eq(ticketTable.id, ticketId),
    with: {
      messages: {
        with: { user: true },
        orderBy: (messages, { desc }) => [desc(messages.createdAt)],
      },
      user: true,
    },
  });
  if (!ticket) return null;
  return DTOTicket(ticket);
}
