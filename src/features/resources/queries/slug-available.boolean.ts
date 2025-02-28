import projectGetIdBySlug from '@/features/resources/queries/resource-get-id-by-slug.get';

export default async function projectSlugAvailable(slug: string) {
  const resourceWithSlug = await projectGetIdBySlug(slug);

  return resourceWithSlug === undefined;
}
