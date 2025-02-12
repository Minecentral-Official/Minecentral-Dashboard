import { db } from '@/lib/db';
import { recentActivityTable } from '@/lib/db/schema';

export async function activityAddAction(
  userId: string,
  activity: ACTIVITY,
  ...args: string[]
) {
  const message = activity.replace(/%s/g, () => args.shift() || '');
  await db.insert(recentActivityTable).values({ action: message, userId });
}

export enum ACTIVITY {
  SUBSCRIPTION_PURCHASED = 'Hosting service purchased - %s Plan',
  NEW_TICKET = 'Created support ticket - #%s',
  NEW_RESOURCE = 'Posted new resource - %s',
}
