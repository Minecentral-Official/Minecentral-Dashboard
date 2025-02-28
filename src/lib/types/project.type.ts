// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const CategoriesProjects = [
  'plugin',
  'mod',
  'datapack',
  'resource-pack',
  'shader-pack',
] as const;

export type T_ProjectCategory = (typeof CategoriesProjects)[number];

// export type PluginDataBasic = typeof resourceTable.$inferSelect & {
//   user: typeof user.$inferSelect;
// };

// export type PluginData_All = PluginDataBasic & {
//   releases: (typeof resourceReleaseTable.$inferSelect)[];
// };
