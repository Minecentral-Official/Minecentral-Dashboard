'use cache';

import { db } from '@/lib/db';

export default async function getUserTickets() {
  const response = await db.query.ticket.findMany();
  console.log(response);
}
