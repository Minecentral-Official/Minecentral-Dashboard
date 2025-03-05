'use server';

import { desc } from 'drizzle-orm';

import DTOResource from '@/features/resources/dto/plugin-basic.dto';
import { T_DTOResource } from '@/features/resources/types/t-dto-resource.type';
import { T_PluginCategory } from '@/features/resources/types/t-plugin-category.type';
import { TPluginVersion } from '@/features/resources/types/t-resource-version-support.type';
import { cacheLife, cacheTag } from '@/lib/cache/cache-exports';
import { db } from '@/lib/db';
import { resourceTable } from '@/lib/db/schema';

export type TGetPluginsRequest = {
  query?: string;
  page: number;
  limit: number;
  categories?: T_PluginCategory[];
  versions?: TPluginVersion[];
};

export type TGetPluginsResponse = {
  resources: T_DTOResource[] | [];
  totalCount: number;
  currentPage: number;
  totalPages: number;
};

export default async function resourcesListAll({
  limit,
  page,
}: TGetPluginsRequest): Promise<TGetPluginsResponse> {
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
    totalCount,
    currentPage: page,
    totalPages,
  };
  return result;
}
