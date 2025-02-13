'use servers';

import { and, desc, ilike, inArray } from 'drizzle-orm';

import { db } from '@/lib/db';
import { resourceTable, user } from '@/lib/db/schema';

type params = {
  search: string;
  page: number;
  limit: number;
  author?: string;
  categories?: number[];
};

export default async function resourcesFindAndFilter({
  search,
  limit,
  page,
  author,
}: params) {
  const conditions = [];

  conditions.push(
    and(
      ilike(resourceTable.title, `%${search}%`),
      ilike(resourceTable.description, `%${search}%`),
      ilike(resourceTable.subtitle, `%${search}%`),
    ),
  );

  let authorIds: string[] = [];

  if (author) {
    // Find user ID(s) that match the given name
    const matchedUsers = await db
      .select({ id: user.id })
      .from(user)
      .where(ilike(user.name, `%${author}%`));

    authorIds = matchedUsers.map((user) => user.id.toString());

    // Add condition to check if author matches either a name or an ID
    conditions.push(inArray(resourceTable.userId, [author, ...authorIds]));
  }

  const whereClause = conditions.length ? and(...conditions) : undefined;

  const [resources, total] = await Promise.all([
    //Query/Filter
    db.query.resource.findMany({
      where: whereClause,
      with: { user: true },
      orderBy: desc(resourceTable.updatedAt),
      limit,
      offset: (page - 1) * limit,
    }),
    //Total Count
    db.query.resource.findMany({ where: whereClause }),
  ]);

  const totalCount = total.length;
  const totalPages = Math.ceil(totalCount / limit);

  return {
    resources,
    totalCount,
    currentPage: page,
    totalPages,
  };
}
