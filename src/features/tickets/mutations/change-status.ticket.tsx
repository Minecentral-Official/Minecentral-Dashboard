'use server';

import { eq } from 'drizzle-orm';

import validateSession from '@/lib/auth/helpers/validate-session';
import { db } from '@/lib/db';
import { ticket, TTicketStatuses } from '@/lib/db/schema';

export default async function ticketsChangeStatus({
  ticketId,
  status,
}: {
  ticketId: number;
  status: (typeof TTicketStatuses)[number];
}) {
  const { user } = await validateSession();

  await db.update(ticket).set({ status }).where(eq(ticket.id, ticketId));
}
