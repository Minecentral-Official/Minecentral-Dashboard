'use server';

import { parseWithZod } from '@conform-to/zod';
import { redirect } from 'next/navigation';

import { insertTicketWithMessageZod } from '@/features/tickets/schemas/ticket-with-message.zod';
import validateSession from '@/lib/auth/helpers/validate-session';
import { db } from '@/lib/db';
import { ticket, ticketMessage } from '@/lib/db/schema';

export default async function createTicketWithMessage(
  // prevState: unknown
  _: unknown,
  formData: FormData,
) {
  console.log('this action ran');
  const { user } = await validateSession();
  const submission = parseWithZod(formData, {
    schema: insertTicketWithMessageZod,
  });

  if (submission.status !== 'success') {
    return submission.reply();
  }

  const { category, message, title } = submission.value;

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

  redirect(
    '/dashboard/tickets?toast-success=true&toast-message=Ticket%20successfully%20created&toast-id=create-ticket',
  );
}
