import { eq } from 'drizzle-orm';

import { cacheLife, cacheTag } from '@/lib/cache/cache-exports';
import { db } from '@/lib/db';
import { serverTable } from '@/lib/db/schema';
import lower from '@/lib/db/utils/lower';

export async function serverGetIdBySlug(slug: string) {
  'use cache';
  cacheLife('hours');
  cacheTag(`server-slug-${slug}`);
  const resource = await db.query.serverTable.findFirst({
    where: eq(lower(serverTable.slug), slug.toLowerCase()),
  });

  return resource?.id;
}
