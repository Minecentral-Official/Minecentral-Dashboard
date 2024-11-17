import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

import * as authTable from "@/auth/schema/auth.table";
import * as ticketTable from "@/features/tickets/schema/ticket.table";

export const db = drizzle(process.env.DATABASE_URL!, {
  schema: { ...authTable, ...ticketTable },
  casing: "camelCase",
});
