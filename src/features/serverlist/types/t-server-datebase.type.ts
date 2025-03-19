import { serverTable, userTable } from '@/lib/db/schema';

export type T_ServerDBData = typeof serverTable.$inferSelect & {
  user: typeof userTable.$inferSelect;
  votes: number;
};
