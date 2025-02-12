'use server';

import { parseWithZod } from '@conform-to/zod';
import { and, eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';

import { updateTicketStatusZod } from '@/features/tickets/schemas/ticket-status.zod';
import validateSession from '@/lib/auth/helpers/validate-session';
import { db } from '@/lib/db';
import { ticket as ticketTable } from '@/lib/db/schema';

export default async function ticketChangeStatus(
  _: unknown,
  formData: FormData,
) {
  const { user } = await validateSession();

  const submission = parseWithZod(formData, {
    schema: updateTicketStatusZod,
  });
  if (submission.status !== 'success') {
    return submission.reply();
  }

  const { id, status } = submission.value;

  const ticket = await db.query.ticket.findFirst({
    where: and(eq(ticketTable.userId, user.id), eq(ticketTable.id, id)),
  });

  if (!ticket) {
    throw new Error('Unauthorized');
  }

  await db.update(ticketTable).set({ status }).where(eq(ticketTable.id, id));
  revalidateTag(`ticket-${id}`);
}
