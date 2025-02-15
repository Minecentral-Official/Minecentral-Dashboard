export const pluginCategoriesConfig = [
  'chat',
  'economy',
  'cosmetic',
  'world',
  'gamemode',
  'utility',
  'admin',
  'proxy',
  'misc',
] as const;

export type PluginCategory = (typeof pluginCategoriesConfig)[number];
