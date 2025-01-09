import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { user } from '@/lib/db/schema';

import 'server-only';

export default async function getUserByEmail(email: string) {
  const _user = db.query.user.findFirst({
    where: eq(user.email, email),
  });
  return _user;
}
