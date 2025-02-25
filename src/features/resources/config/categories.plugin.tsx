export const TPluginCategories = [
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

export type TPluginCategories = typeof TPluginCategories;
export type TPluginCategory = TPluginCategories[number];
