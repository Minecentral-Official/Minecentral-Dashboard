'use server';

import { eq } from 'drizzle-orm';

import { ticketStatusConfig } from '@/features/tickets/config/ticket-status.config';
import validateSession from '@/lib/auth/helpers/validate-session';
import { db } from '@/lib/db';
import { ticket } from '@/lib/db/schema';

export default async function ticketsChangeStatus({
  ticketId,
  status,
}: {
  ticketId: number;
  status: (typeof ticketStatusConfig)[number];
}) {
  const { user } = await validateSession();

  await db.update(ticket).set({ status }).where(eq(ticket.id, ticketId));
}
