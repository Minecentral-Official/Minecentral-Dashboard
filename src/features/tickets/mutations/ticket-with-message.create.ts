'use server';

import { parseWithZod } from '@conform-to/zod';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

import { ticketCreateWithMessageZod } from '@/features/tickets/schemas/zod/ticket-with-message.zod';
import {
  ACTIVITY,
  activityAddAction,
} from '@/lib/activity/mutations/activity.add';
import validateSession from '@/lib/auth/helpers/validate-session';
import { db } from '@/lib/db';
import { ticket, ticketMessage } from '@/lib/db/schema';

export default async function ticketCreateWithMessage(
  // prevState: unknown
  _: unknown,
  formData: FormData,
) {
  const { user } = await validateSession();
  const submission = parseWithZod(formData, {
    schema: ticketCreateWithMessageZod,
  });

  if (submission.status !== 'success') {
    return submission.reply();
  }

  const { category, message, title } = submission.value;

  const newTicket = await db.transaction(async (tx) => {
    //Insert new ticket info
    const newTicket = await tx
      .insert(ticket)
      .values({ category, title, userId: user.id })
      .returning();
    //Insert first message as Ticket Message
    await tx
      .insert(ticketMessage)
      .values({ message, ticketId: newTicket[0].id, userId: user.id });
    return newTicket;
  });

  await activityAddAction(user.id, ACTIVITY.NEW_TICKET, `${newTicket[0].id}`);

  revalidateTag(`tickets-user-${user.id}`);

  redirect(
    '/dashboard/tickets?toast-success=true&toast-message=Ticket%20successfully%20created&toast-id=create-ticket',
  );
}
