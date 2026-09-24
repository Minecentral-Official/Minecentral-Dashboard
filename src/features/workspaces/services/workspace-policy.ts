export type WorkspaceRole = 'owner' | 'admin' | 'editor' | 'viewer';
export type WorkspacePermission =
  | 'read'
  | 'settings'
  | 'content'
  | 'members'
  | 'lifecycle';
const grants: Record<WorkspaceRole, readonly WorkspacePermission[]> = {
  owner: ['read', 'settings', 'content', 'members', 'lifecycle'],
  admin: ['read', 'settings', 'content'],
  editor: ['read', 'content'],
  viewer: ['read'],
};
export function canUseWorkspace(
  role: string | null,
  permission: WorkspacePermission,
) {
  return (
    role !== null &&
    Object.hasOwn(grants, role) &&
    grants[role as WorkspaceRole].includes(permission)
  );
}
export class WorkspaceError extends Error {
  constructor(
    message: string,
    public readonly code: 'not_found' | 'forbidden' | 'invalid' = 'invalid',
  ) {
    super(message);
  }
}
