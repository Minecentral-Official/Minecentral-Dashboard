'use server';

import validateSession from '@/lib/auth/helpers/validate-session';
import { db } from '@/lib/db';
import { ticket, ticketMessage } from '@/lib/db/schema';

export default async function ticketsCreate({
  category,
  title,
  message,
}: {
  category: string;
  title: string;
  message: string;
}) {
  const { user } = await validateSession();

  await db.transaction(async (tx) => {
    //Insert new ticket info
    const newTicket = await tx
      .insert(ticket)
      .values({ category, title, userId: user.id })
      .returning();
    //Insert first message as Ticket Message
    await tx
      .insert(ticketMessage)
      .values({ message, ticketId: newTicket[0].id, userId: user.id });
  });
}
