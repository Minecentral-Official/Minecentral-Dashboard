import { serverTable, serverVotifierTable, userTable } from '@/lib/db/schema';

export type T_ServerDBData_Base = typeof serverTable.$inferSelect & {
  user: typeof userTable.$inferSelect;
};

export type T_ServerDBData_WithVotes = T_ServerDBData_Base & {
  votes: number;
};

export type T_ServerDBData_Votifier = typeof serverVotifierTable.$inferSelect;
