'use server';

import {
  and,
  arrayContains,
  desc,
  eq,
  ilike,
  inArray,
  or,
  sql,
} from 'drizzle-orm';

import DTOResource from '@/features/resources/dto/plugin-basic.dto';
import { T_ResourceFilterRequest } from '@/features/resources/types/t-resource-api-request.type';
import { T_ResourcesResponse } from '@/features/resources/types/t-resource-api-response.type';
import { cacheLife, cacheTag } from '@/lib/cache/cache-exports';
import { db } from '@/lib/db';
import {
  likedResourceTable,
  resourceReleaseTable,
  resourceTable,
  userTable,
} from '@/lib/db/schema';

export default async function serverlistListAllFiltered({
  query,
  limit,
  page,
  categories,
  versions,
  type,
  loaders,
}: T_ResourceFilterRequest): Promise<T_ResourcesResponse> {
  'use cache';
  cacheLife('minutes');
  cacheTag(
    `filter-${query}-${limit}-${page}-${categories?.toString()}-${versions?.toString()}`,
  );
  // Base conditions for the resource table
  const resourceConditions = [
    eq(resourceTable.status, 'accepted'),
    eq(resourceTable.type, type),
  ];

  // Text search conditions
  const textConditions = [];

  // Query based Filters
  if (query) {
    // Search Filter on Title, Description or SubTitle
    textConditions.push(
      or(
        ilike(resourceTable.title, `%${query}%`),
        ilike(resourceTable.description, `%${query}%`),
        ilike(resourceTable.subtitle, `%${query}%`),
      ),
    );

    // Author Filter
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

  // Category Filter
  if (categories && categories.length > 0)
    resourceConditions.push(
      arrayContains(resourceTable.categories, categories),
    );

  // Combine resource conditions with text conditions
  const resourceWhereClause =
    textConditions.length > 0 ?
      and(or(...textConditions), and(...resourceConditions))
    : and(...resourceConditions);

  // Release conditions for filtering by version and loaders
  const releaseConditions = [];

  // Versions Filter
  if (versions && versions.length > 0) {
    releaseConditions.push(
      arrayContains(resourceReleaseTable.compatibleVersions, versions),
    );
  }

  // Loaders Filter
  if (loaders && loaders.length > 0) {
    releaseConditions.push(
      arrayContains(resourceReleaseTable.loaders, loaders),
    );
  }
  // Query/Filter
  const [resources, total] = await Promise.all([
    db.query.resourceTable.findMany({
      with: {
        user: true,
        releases: {
          where:
            releaseConditions.length > 0 ?
              and(...releaseConditions)
            : undefined,
          orderBy: (releases, { desc }) => [desc(releases.createdAt)],
          limit: 1,
        },
      },
      where: resourceWhereClause,
      orderBy: desc(resourceTable.updatedAt),
      limit,
      offset: Math.max(0, page - 1) * limit,
      extras: {
        likes:
          sql<number>`(SELECT count(*) from ${likedResourceTable} WHERE "resource_id" = ${resourceTable.id})`.as(
            'likes',
          ),
        downloads:
          sql<number>`(SELECT count(*) FROM ${resourceReleaseTable} WHERE "pluginId" = ${resourceTable.id})`.as(
            'downloads',
          ),
      },
    }),
    // For total count, we need to consider resources that have at least one matching release
    db
      .select({ id: resourceTable.id })
      .from(resourceTable)
      .leftJoin(
        resourceReleaseTable,
        eq(resourceTable.id, resourceReleaseTable.pluginId),
      )
      .where(
        and(
          resourceWhereClause,
          releaseConditions.length > 0 ? and(...releaseConditions) : undefined,
        ),
      )
      .groupBy(resourceTable.id),
  ]);

  // Filter out resources that don't have any releases matching the criteria
  const filteredResources = resources.filter(
    (resource) => resource.releases && resource.releases.length > 0,
  );

  const totalCount = total.length;
  const totalPages = Math.ceil(totalCount / limit);

  const result = {
    resources: filteredResources.map((resource) => DTOResource(resource)),
    totalPages,
  };
  return result;
}
