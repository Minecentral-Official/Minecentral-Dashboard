'use server';

import { eq } from 'drizzle-orm';

import validateSession from '@/lib/auth/helpers/validate-session';
import { db } from '@/lib/db';
import { ticketMessage, ticket as ticketTable } from '@/lib/db/schema';

export default async function ticketsCreateMessage({
  message,
  ticketId,
}: {
  message: string;
  ticketId: number;
}) {
  const { user } = await validateSession();

  await db.transaction(async (tx) => {
    //Update Ticket Status
    const ticketData = await tx.query.ticket.findFirst({
      where: eq(ticketTable.id, ticketId),
      with: { messages: true },
    });
    if (!ticketData) throw new Error('Invalid ticket id!');
    if (ticketData.userId !== user.id && ticketData.status === 'open') {
      await tx
        .update(ticketTable)
        .set({ status: 'in-progress' })
        .where(eq(ticketTable.id, ticketData.id));
    }
    //Create new Message
    await tx
      .insert(ticketMessage)
      .values({ message, ticketId, userId: user.id })
      .returning();
  });
}
