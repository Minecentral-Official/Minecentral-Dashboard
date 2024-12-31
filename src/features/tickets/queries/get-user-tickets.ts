import { eq } from 'drizzle-orm';

import validateSession from '@/lib/auth/helpers/validate-session';
import { db } from '@/lib/db';
import { ticket } from '@/lib/db/schema';

export default async function getUserTickets() {
  const { user } = await validateSession();

  const response = await db.query.ticket.findMany({
    columns: {
      userId: false,
    },
    where: eq(ticket.userId, user.id),
  });
  console.log(response);
  return response;
}
