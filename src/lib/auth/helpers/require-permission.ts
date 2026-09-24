import 'server-only';

import { hasPermission } from '@/lib/auth/helpers/permissions';
import validateSession from '@/lib/auth/helpers/validate-session';

import type { Permission } from '@/lib/auth/helpers/permissions';

export default async function requirePermission(permission: Permission) {
  const session = await validateSession();
  if (!hasPermission(session.user.role, permission))
    throw new Error('Forbidden');
  return session;
}
