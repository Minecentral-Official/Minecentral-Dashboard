export const CategoriesPlugin = [
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

export type T_PluginCategories = typeof CategoriesPlugin;
export type T_PluginCategory = T_PluginCategories[number];
