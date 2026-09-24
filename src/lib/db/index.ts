import 'server-only';

import { drizzle } from 'drizzle-orm/node-postgres';

import * as schema from '@/lib/db/schema';
import { serverEnv } from '@/lib/env/server.env';

export const db = drizzle({
  connection: {
    connectionString: serverEnv.DATABASE_URL,
    max: serverEnv.DATABASE_POOL_MAX,
  },
  schema,
  casing: 'camelCase',
});
