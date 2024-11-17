
import * as schema from '@/lib/db/schema';
import { serverEnv } from '@/lib/env/server.env';
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";


export const db = drizzle(serverEnv.DATABASE_URL, {
  schema,
  casing: "camelCase",
});
