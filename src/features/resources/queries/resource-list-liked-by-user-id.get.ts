import { eq } from 'drizzle-orm';

import DTOResource from '@/features/resources/dto/plugin-basic.dto';
import { cacheLife, cacheTag } from '@/lib/cache/cache-exports';
import { db } from '@/lib/db';
import { likedResourceTable } from '@/lib/db/schema';

export default async function resourceListLikedByUserId(userId: string) {
  'use cache';
  cacheLife('hours');
  cacheTag(`like-${userId}`);
  const plugins = await db.query.likedResourceTable.findMany({
    where: eq(likedResourceTable.userId, userId),
    with: { resource: { with: { user: true } } },
  });

  return plugins.map((plugin) => DTOResource(plugin.resource));
}
