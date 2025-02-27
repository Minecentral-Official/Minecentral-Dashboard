export const roleConfig = ['admin', 'user'] as const;
export type T_Roles = typeof roleConfig[number];
