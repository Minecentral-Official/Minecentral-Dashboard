'use server';

import { parseWithZod } from '@conform-to/zod';
import { eq } from 'drizzle-orm';

import { ticketUpdateStatusZod } from '@/features/tickets/schemas/zod/ticket-status.zod';
import { assertOwnedRecord } from '@/lib/auth/helpers/permissions';
import validateSession from '@/lib/auth/helpers/validate-session';
import { invalidateTag as revalidateTag } from '@/lib/cache/invalidate-tag';
import { db } from '@/lib/db';
import { ticket as ticketTable } from '@/lib/db/schema';

export default async function ticketChangeStatus(
  _: unknown,
  formData: FormData,
) {
  const { user } = await validateSession();

  const submission = parseWithZod(formData, {
    schema: ticketUpdateStatusZod,
  });
  if (submission.status !== 'success') {
    return submission.reply();
  }

  const { id, status } = submission.value;

  const ticket = await db.query.ticket.findFirst({
    where: eq(ticketTable.id, id),
  });

  if (!ticket) {
    throw new Error('Unauthorized');
  }

  assertOwnedRecord(user, ticket.userId, 'tickets:support');
  await db.update(ticketTable).set({ status }).where(eq(ticketTable.id, id));
  revalidateTag(`ticket-${id}`);
}
