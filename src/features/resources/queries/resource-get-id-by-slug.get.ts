import { eq } from 'drizzle-orm';

import { resourceTable } from '@/features/resources/schemas/resource.table';
import { cacheLife, cacheTag } from '@/lib/cache/cache-exports';
import { db } from '@/lib/db';
import lower from '@/lib/db/utils/lower';

export default async function projectGetIdBySlug(slug: string) {
  'use cache';
  cacheLife('hours');
  cacheTag(`resource-slug-${slug}`);
  const resource = await db.query.resourceTable.findFirst({
    where: eq(lower(resourceTable.slug), slug.toLowerCase()),
  });

  return resource?.id;
}
