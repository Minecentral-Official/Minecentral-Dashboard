export const CategoriesProjects = [
  'plugin',
  'mod',
  'datapack',
  'resource-pack',
  'shader-pack',
] as const;

export type T_ProjectCategory = (typeof CategoriesProjects)[number];
