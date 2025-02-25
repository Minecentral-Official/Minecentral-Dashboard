import { resourceTable, userTable } from '@/lib/db/schema';

export type T_ResourceDBData = typeof resourceTable.$inferSelect & {
  user: typeof userTable.$inferSelect;
};
