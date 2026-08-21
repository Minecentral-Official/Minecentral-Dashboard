export const C_ServerAccessTypes = [
  'public',
  'whitelist',
  'application',
] as const;

export type T_ServerAccessType = (typeof C_ServerAccessTypes)[number];
