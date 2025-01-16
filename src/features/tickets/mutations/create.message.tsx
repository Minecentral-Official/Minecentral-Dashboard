'use server';

import validateSession from '@/lib/auth/helpers/validate-session';
import { db } from '@/lib/db';
import { ticketMessage } from '@/lib/db/schema';

export default async function ticketsCreateMessage({
  message,
  ticketId,
}: {
  message: string;
  ticketId: number;
}) {
  const { user } = await validateSession();

  await db
    .insert(ticketMessage)
    .values({ message, ticketId, userId: user.id })
    .returning();
  // console.log(tickets);
  //   return new NextResponse('Thank you', { status: 200 });
}
