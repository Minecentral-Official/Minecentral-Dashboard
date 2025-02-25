import { resourceReleaseTable, resourceTable, user } from '@/lib/db/schema';

export type PluginDataBasic = typeof resourceTable.$inferSelect & {
  user: typeof user.$inferSelect;
};

export type PluginData_All = PluginDataBasic & {
  releases: (typeof resourceReleaseTable.$inferSelect)[];
};
