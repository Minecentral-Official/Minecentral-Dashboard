import { TPluginCategories } from '@/features/resource-plugin/config/categories.plugin';
import resourcesFindAndFilter from '@/features/resource-plugin/queries/resources-find.filter';

import type { TPluginCategory } from '@/features/resource-plugin/config/categories.plugin';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  const categories = searchParams
    .getAll('category')
    .filter((category): category is TPluginCategory =>
      TPluginCategories.includes(category as TPluginCategory),
    );

  // TODO: add version
  //   const version = searchParams
  //     .getAll('v')
  //     .filter((version): version is TPluginVersion =>
  //       TPluginVersions.includes(version as TPluginVersion),
  //     );

  const page = Number.parseInt(searchParams.get('p') || '0', 10);
  const limit = Number.parseInt(searchParams.get('limit') || '10', 10);

  const result = await resourcesFindAndFilter({
    query,
    limit,
    page,
    categories,
  });
  return result;
}
