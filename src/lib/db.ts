import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "@/auth/auth-schema";

export const db = drizzle(process.env.DATABASE_URL!, { schema });
