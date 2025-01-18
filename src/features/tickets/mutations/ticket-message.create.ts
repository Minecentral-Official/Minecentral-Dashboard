'use server';

import { parseWithZod } from '@conform-to/zod';
import { eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';

import { insertTicketMessageZod } from '@/features/tickets/schemas/ticket-message.zod';
import validateSession from '@/lib/auth/helpers/validate-session';
import { db } from '@/lib/db';
import { ticketMessage, ticket as ticketTable } from '@/lib/db/schema';

export default async function createTicketMessage(
  //prevState: unknown
  _: unknown,
  formData: FormData,
) {
  const { user } = await validateSession();

  const submission = parseWithZod(formData, {
    schema: insertTicketMessageZod,
  });

  if (submission.status !== 'success') {
    return submission.reply();
  }

  const { message, ticketId } = submission.value;
  console.log('message: ', message);
  await db.transaction(async (tx) => {
    //Update Ticket Status
    const ticketData = await tx.query.ticket.findFirst({
      where: eq(ticketTable.id, ticketId),
      with: { messages: true },
    });
    if (!ticketData) throw new Error('Invalid ticket id!');
    if (ticketData.userId !== user.id && ticketData.status === 'open') {
      // to automatically switch status to 'in-progress'
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
  // TODO: once we have caching we can have more granular control here
  revalidateTag(`ticket-${ticketId}`);
}
