import { eq } from 'drizzle-orm';

import 'server-only';

import validateSession from '@/lib/auth/helpers/validate-session';
import { db } from '@/lib/db';
import { ticket } from '@/lib/db/schema';

export default async function ticketsGetAll() {
  const { user } = await validateSession();

  const response = await db.query.ticket.findMany({
    where: eq(ticket.userId, user.id),
    with: { messages: true },
  });
  return response;
}
