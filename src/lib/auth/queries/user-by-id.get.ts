import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { userTable } from '@/lib/db/schema';

import 'server-only';

export default async function getUserById(userId: string) {
  const _user = await db.query.user.findFirst({
    where: eq(userTable.id, userId),
  });
  return _user;
}
