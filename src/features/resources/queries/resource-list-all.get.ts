'use server';

import { desc } from 'drizzle-orm';

import DTOResource from '@/features/resources/dto/plugin-basic.dto';
import { T_ResourceSimpleRequest } from '@/features/resources/types/t-resource-api-request.type';
import { T_ResourcesResponse } from '@/features/resources/types/t-resource-api-response.type';
import { cacheLife, cacheTag } from '@/lib/cache/cache-exports';
import { db } from '@/lib/db';
import { resourceTable } from '@/lib/db/schema';

export default async function resourcesListAll({
  limit,
  page,
}: T_ResourceSimpleRequest): Promise<T_ResourcesResponse> {
  'use cache';
  cacheLife('minutes');
  cacheTag(`resources-all-${limit}-${page}`);

  const [resources, total] = await Promise.all([
    db.query.resourceTable.findMany({
      with: {
        user: true,
        releases: {
          limit: 1,
          orderBy: (releases, { desc }) => [desc(releases.createdAt)],
        },
      },
      orderBy: desc(resourceTable.updatedAt),
      limit,
      offset: Math.max(0, page - 1) * limit,
    }),
    //Total Count
    db.query.resourceTable.findMany(),
  ]);

  const totalCount = total.length;
  const totalPages = Math.ceil(totalCount / limit);

  const result = {
    resources: resources.map((resource) => DTOResource(resource)),
    totalPages,
  };
  return result;
}
