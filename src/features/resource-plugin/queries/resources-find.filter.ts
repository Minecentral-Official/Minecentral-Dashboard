'use server';

import { and, arrayContains, desc, ilike, inArray, or } from 'drizzle-orm';

import { TPluginCategory } from '@/features/resource-plugin/config/categories.plugin';
import DTOResourcePlugin from '@/features/resource-plugin/dto/plugin.dto';
import { TResourcePlugin } from '@/features/resource-plugin/types/plugin.type';
import { db } from '@/lib/db';
import { pluginTable, user } from '@/lib/db/schema';

export type TGetPluginsRequest = {
  query?: string;
  page: number;
  limit: number;
  categories?: TPluginCategory[];
};

export type TGetPluginsResponse = {
  resources: TResourcePlugin[] | [];
  totalCount: number;
  currentPage: number;
  totalPages: number;
};

export default async function pluginsGet({
  query,
  limit,
  page,
  categories,
}: TGetPluginsRequest): Promise<TGetPluginsResponse> {
  const otherConditions = [];
  const textConditions = [];

  if (query)
    textConditions.push(
      or(
        ilike(pluginTable.title, `%${query}%`),
        ilike(pluginTable.description, `%${query}%`),
        ilike(pluginTable.subtitle, `%${query}%`),
      ),
    );

  if (categories && categories.length > 0)
    otherConditions.push(arrayContains(pluginTable.categories, categories));

  //Author Search
  let authorIds: string[] = [];
  // Find user ID(s) that match the given name
  if (query) {
    const matchedUsers = await db
      .select({ id: user.id })
      .from(user)
      .where(ilike(user.name, `%${query}%`));
    authorIds = matchedUsers.map((user) => user.id.toString());
    // Add condition to check if author matches either a name or an ID
    textConditions.push(inArray(pluginTable.userId, [...authorIds]));
  }

  //Query/Filter
  const whereClause = and(or(...textConditions), and(...otherConditions));

  const [resources, total] = await Promise.all([
    db.query.pluginTable.findMany({
      where: whereClause,
      with: { user: true },
      orderBy: desc(pluginTable.updatedAt),
      limit,
      offset: Math.max(0, page - 1) * limit,
    }),
    //Total Count
    db.query.pluginTable.findMany({ where: whereClause }),
  ]);

  const totalCount = total.length;
  const totalPages = Math.ceil(totalCount / limit);

  const result = {
    resources: resources.map((resource) => DTOResourcePlugin(resource)),
    totalCount,
    currentPage: page,
    totalPages,
  };
  return result;
}
