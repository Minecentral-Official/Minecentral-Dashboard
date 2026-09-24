import type { T_Roles } from '@/lib/auth/configs/roles.config';

export const permissions = [
  'admin:access',
  'catalog:curate',
  'resources:moderate',
  'tickets:support',
  'users:manage',
] as const;
export type Permission = (typeof permissions)[number];
const grants: Record<T_Roles, readonly Permission[]> = {
  user: [],
  curator: ['admin:access', 'catalog:curate'],
  moderator: ['admin:access', 'resources:moderate', 'tickets:support'],
  admin: permissions,
};
export function hasPermission(
  role: string | null | undefined,
  permission: Permission,
) {
  // Unknown/comma-separated roles fail closed; role assignment is admin-only.
  return (
    role !== undefined &&
    role !== null &&
    Object.hasOwn(grants, role) &&
    grants[role as T_Roles].includes(permission)
  );
}
export function canAccessOwnedRecord(
  user: { id: string; role?: string | null },
  ownerId: string,
  override?: Permission,
) {
  return (
    user.id === ownerId ||
    (override !== undefined && hasPermission(user.role, override))
  );
}
export function assertOwnedRecord(
  user: { id: string; role?: string | null },
  ownerId: string,
  override?: Permission,
) {
  if (!canAccessOwnedRecord(user, ownerId, override))
    throw new Error('Forbidden');
}
