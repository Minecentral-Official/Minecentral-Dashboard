

import { roleConfig, T_Roles } from '@/lib/auth/configs/roles.config';
import validateSession from '@/lib/auth/helpers/validate-session';
import { resourceGetById } from './resource-by-id.get';

export default async function resourceCanEdit(
  resourceId: string
) {

  const {user} = await validateSession();

  if (!user) return false;
  if (user.role === "admin") return true;

  const resource = await resourceGetById(resourceId);

  if (!resource) return false;

  return resource.author.id === user.id;
}

