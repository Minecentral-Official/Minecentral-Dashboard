import { eq } from 'drizzle-orm';

import { resourceTable } from '@/features/resources/schemas/resource.table';
import { db } from '@/lib/db';

export default async function resourceGetIdBySlug(slug: string) {
  const resource = await db.query.resourceTable.findFirst({
    where: eq(resourceTable.slug, slug),
  });

  return resource?.id;
}
