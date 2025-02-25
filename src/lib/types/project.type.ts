// eslint-disable-next-line @typescript-eslint/no-unused-vars
const projectTypes = [
  'project', //added by default to projects knowing data is missing
  'plugin',
  'mod',
  'datapack',
  'resource-pack',
  'shader-pack',
] as const;

export type T_Project = (typeof projectTypes)[number];

// export type PluginDataBasic = typeof resourceTable.$inferSelect & {
//   user: typeof user.$inferSelect;
// };

// export type PluginData_All = PluginDataBasic & {
//   releases: (typeof resourceReleaseTable.$inferSelect)[];
// };
