import { eq } from 'drizzle-orm';

import { resourceTable } from '@/features/resources/schemas/resource.table';
import { cacheLife, cacheTag } from '@/lib/cache/cache-exports';
import { db } from '@/lib/db';

export default async function resourceGetIdBySlug(slug: string) {
  'use cache';
  cacheLife('minutes');
  cacheTag(`resource-slug-${slug}`);
  const resource = await db.query.resourceTable.findFirst({
    where: eq(resourceTable.slug, slug),
  });

  return resource?.id;
}
