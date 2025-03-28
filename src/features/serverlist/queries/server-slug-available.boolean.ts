import { serverGetIdBySlug } from '@/features/serverlist/queries/server-get-id-by-slug.get';

export default async function serverSlugAvailable(slug: string) {
  const serverWithSlug = await serverGetIdBySlug(slug);

  return serverWithSlug === undefined;
}
