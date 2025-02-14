import { eq } from 'drizzle-orm';

import 'server-only';

import DTOTicket from '@/features/tickets/dto/ticket.dto';
import validateSession from '@/lib/auth/helpers/validate-session';
import { cacheLife, cacheTag } from '@/lib/cache/cache-exports';
import { db } from '@/lib/db';
import { ticket } from '@/lib/db/schema';

export default async function ticketsGetAll() {
  const { user } = await validateSession();
  return await cachedTickets(user.id);
}

async function cachedTickets(userId: string) {
  'use cache';
  cacheLife('hours');
  cacheTag(`tickets-user-${userId}`);

  const response = await db.query.ticket.findMany({
    where: eq(ticket.userId, userId),
    with: {
      messages: { with: { user: true }, limit: 1 },
      user: true,
    },
  });
  return response.map((ticket) => DTOTicket(ticket));
}
