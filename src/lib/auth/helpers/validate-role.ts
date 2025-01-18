import validateSession from '@/lib/auth/helpers/validate-session';

import type { roleConfig } from '@/lib/auth/configs/roles.config';

export default async function validateRole(role: (typeof roleConfig)[number]) {
  const { user } = await validateSession();

  return user.role === role;
}
