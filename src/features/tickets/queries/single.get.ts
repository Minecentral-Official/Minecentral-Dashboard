import { and, eq } from 'drizzle-orm';

import 'server-only';

import validateSession from '@/lib/auth/helpers/validate-session';
import { db } from '@/lib/db';
import { ticket } from '@/lib/db/schema';

export default async function ticketsGetSingle(ticketId: number) {
  const { user } = await validateSession();

  const response = await db.query.ticket.findFirst({
    where: and(eq(ticket.userId, user.id), eq(ticket.id, ticketId)),
    with: {
      messages: {
        with: { user: true },
        orderBy: (messages, { desc }) => [desc(messages.createdAt)],
      },
      user: true,
    },
  });
  return response;
}
