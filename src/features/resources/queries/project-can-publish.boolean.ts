import { projectGetById } from '@/features/resources/queries/project-by-id.get';

export async function projectCanPublish(
  resourceId: string,
): Promise<{ result: true } | { result: false; reason: string }> {
  const resource = await projectGetById(resourceId);

  if (!resource) return { result: false, reason: 'Cant find plugin' };
  if (resource.status === 'accepted' || resource.status === 'pending')
    return { result: false, reason: 'Already accepted or is pending!' };
  if (!resource.release)
    return { result: false, reason: 'Must upload a release' };
  if (!resource.description)
    return { result: false, reason: 'Must create a description' };
  return { result: true };
}
