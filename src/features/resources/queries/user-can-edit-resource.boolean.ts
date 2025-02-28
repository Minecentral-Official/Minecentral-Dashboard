import { resourceGetById } from '@/features/resources/queries/resource-by-id.get';
import validateSession from '@/lib/auth/helpers/validate-session';

export default async function projectCanEdit(resourceId: string) {
  const { user } = await validateSession();

  if (!user) return false;
  if (user.role === 'admin') return true;

  const resource = await resourceGetById(resourceId);

  if (!resource) return false;

  return resource.author.id === user.id;
}
