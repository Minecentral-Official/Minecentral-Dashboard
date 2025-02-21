import { pluginReleaseTable, pluginTable, user } from '@/lib/db/schema';

export type PluginDataBase = typeof pluginTable.$inferSelect & {
  user: typeof user.$inferSelect;
};

export type PluginData = PluginDataBase & {
  releases: (typeof pluginReleaseTable.$inferSelect)[];
};
