import 'server-only';

import { db } from '@/lib/db';
import { hostSubscription } from '@/lib/db/schema';

//Adds a server for a user
export default async function addHostServer({
  user_id,
  server_id,
}: {
  user_id: string;
  server_id: string;
}) {}
