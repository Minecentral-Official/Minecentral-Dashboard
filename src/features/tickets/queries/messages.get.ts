import { eq } from 'drizzle-orm';

import DTOTicketMessage from '@/features/tickets/dto/ticket-message.dto';
import { cacheLife, cacheTag } from '@/lib/cache/cache-exports';
import { db } from '@/lib/db';
import { ticketMessage } from '@/lib/db/schema';

export default async function ticketMessagesGet(ticketId: number) {
  const messages = await cachedMessages(ticketId);
  return messages.map((message) => DTOTicketMessage(message));
}

async function cachedMessages(ticketId: number) {
  'use cache';
  cacheLife('minutes');
  cacheTag(`ticket-messages-${ticketId}`);
  return await db.query.ticketMessage.findMany({
    where: eq(ticketMessage.ticketId, ticketId),
    orderBy: (messages, { desc }) => [desc(messages.createdAt)],
    with: {
      user: true,
    },
  });
}
