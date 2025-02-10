import { eq } from 'drizzle-orm';

import validateSession from '@/lib/auth/helpers/validate-session';
import { db } from '@/lib/db';
import { user } from '@/lib/db/schema';

import 'server-only';

export async function setAdmin() {
  // just returning here to satisfy eslint unused vars rule. Eventually this will connect to db and create a server for a user
  const {
    user: { id },
  } = await validateSession();
  await db.update(user).set({ role: 'admin' }).where(eq(user.id, id));
}
