import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { userTable } from '@/lib/db/schema';

import 'server-only';

export default async function getUserByEmail(email: string) {
  const _user = await db.query.user.findFirst({
    where: eq(userTable.email, email),
  });
  return _user;
}
