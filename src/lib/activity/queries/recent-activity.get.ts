import { desc, eq } from 'drizzle-orm';

import validateSession from '@/lib/auth/helpers/validate-session';
import { db } from '@/lib/db';
import { recentActivityTable } from '@/lib/db/schema';

export async function activityGetRecent() {
  const { user } = await validateSession();

  const activity = db.query.recentActivityTable.findMany({
    where: eq(recentActivityTable.userId, user.id),
    orderBy: [desc(recentActivityTable.id)],
  });

  return activity;
}
