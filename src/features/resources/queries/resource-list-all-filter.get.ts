'use server';

import { and, arrayContains, desc, eq, ilike, inArray, or } from 'drizzle-orm';

import DTOResource from '@/features/resources/dto/plugin-basic.dto';
import {
  T_ResourceFilterRequest,
  T_ResourcesResponse,
} from '@/features/resources/types/t-resource-api-responses.type';
import { cacheLife, cacheTag } from '@/lib/cache/cache-exports';
import { db } from '@/lib/db';
import {
  resourceReleaseTable,
  resourceTable,
  userTable,
} from '@/lib/db/schema';

export default async function resourcesListAllFiltered({
  query,
  limit,
  page,
  categories,
  versions,
  type,
}: T_ResourceFilterRequest): Promise<T_ResourcesResponse> {
  'use cache';
  cacheLife('minutes');
  cacheTag(
    `filter-${query}-${limit}-${page}-${categories?.toString()}-${versions?.toString()}`,
  );
  const otherConditions = [
    eq(resourceTable.status, 'accepted'),
    eq(resourceTable.type, type),
  ];
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
      .select({ id: userTable.id })
      .from(userTable)
      .where(ilike(userTable.name, `%${query}%`));
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
    resources: resources.map((resource) => DTOResource(resource)),
    totalPages,
  };
  return result;
}
