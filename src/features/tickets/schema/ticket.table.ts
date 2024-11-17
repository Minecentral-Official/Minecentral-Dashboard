import { user } from "@/auth/schema/auth.table";
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const ticket = pgTable("ticket", {
  id: integer().primaryKey().generatedAlwaysAsIdentity({ startWith: 1000 }),
  userId: integer()
    .notNull()
    .references(() => user.id),
  subject: text().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  serverUUID: text(),
  resolved: boolean().notNull().default(false),
});
