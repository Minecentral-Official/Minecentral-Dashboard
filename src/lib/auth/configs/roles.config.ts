export const roleConfig = ['user', 'curator', 'moderator', 'admin'] as const;
export type T_Roles = (typeof roleConfig)[number];
