'use server';

import { and, arrayContains, desc, ilike, inArray, or } from 'drizzle-orm';

import { TPluginCategory } from '@/features/resources/config/categories.plugin';
import { TPluginVersion } from '@/features/resources/config/versions.plugin';
import DTOResourcePluginBasic from '@/features/resources/dto/plugin-basic.dto';
import { TResourcePluginBasic } from '@/features/resources/types/plugin-basic.type';
import { cacheLife, cacheTag } from '@/lib/cache/cache-exports';
import { db } from '@/lib/db';
import { resourceReleaseTable, resourceTable, user } from '@/lib/db/schema';

export type TGetPluginsRequest = {
  query?: string;
  page: number;
  limit: number;
  categories?: TPluginCategory[];
  versions?: TPluginVersion[];
};

export type TGetPluginsResponse = {
  resources: TResourcePluginBasic[] | [];
  totalCount: number;
  currentPage: number;
  totalPages: number;
};

export default async function resourcesGetFiltered({
  query,
  limit,
  page,
  categories,
  versions,
}: TGetPluginsRequest): Promise<TGetPluginsResponse> {
  'use cache';
  cacheLife('minutes');
  cacheTag(
    `filter-${query}-${limit}-${page}-${categories?.toString()}-${versions?.toString()}`,
  );
  const otherConditions = [];
  const textConditions = [];

  //Query based Filters
  if (query) {
    //Search Filter on Title, Description or SubTitle
    textConditions.push(
      or(
        ilike(resourceTable.title, `%${query}%`),
        ilike(resourceTable.description, `%${query}%`),
        ilike(resourceTable.subtitle, `%${query}%`),
      ),
    );

    //Author Filter
    let authorIds: string[] = [];
    // Find user ID(s) that match the given name
    const matchedUsers = await db
      .select({ id: user.id })
      .from(user)
      .where(ilike(user.name, `%${query}%`));
    authorIds = matchedUsers.map((user) => user.id.toString());
    // Add condition to check if author matches either a name or an ID
    textConditions.push(inArray(resourceTable.userId, [...authorIds]));
  }
  //Category Filter
  if (categories && categories.length > 0)
    otherConditions.push(arrayContains(resourceTable.categories, categories));

  //Versions Filter
  if (versions && versions.length > 0)
    otherConditions.push(
      arrayContains(resourceReleaseTable.compatibleVersions, versions),
    );

  //Query/Filter
  const whereClause = and(or(...textConditions), and(...otherConditions));

  const [resources, total] = await Promise.all([
    db.query.resourceTable.findMany({
      with: {
        user: true,
        releases: {
          limit: 1,
          orderBy: (releases, { desc }) => [desc(releases.createdAt)],
        },
      },
      where: whereClause,
      orderBy: desc(resourceTable.updatedAt),
      limit,
      offset: Math.max(0, page - 1) * limit,
    }),
    //Total Count
    db.query.resourceTable.findMany({ where: whereClause }),
  ]);

  const totalCount = total.length;
  const totalPages = Math.ceil(totalCount / limit);

  const result = {
    resources: resources.map((resource) => DTOResourcePluginBasic(resource)),
    totalCount,
    currentPage: page,
    totalPages,
  };
  return result;
}
