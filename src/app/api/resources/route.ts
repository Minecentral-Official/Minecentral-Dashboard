import { NextRequest, NextResponse } from 'next/server';

import { C_PluginCategories } from '@/features/resources/config/c-plugin-categories.config';
import { C_PluginLoaders } from '@/features/resources/config/c-plugin-loaders.plugin';
import resourcesListAllFiltered from '@/features/resources/queries/resource-list-all-filter.get';
import { S_ResourceFilterRequestSchema } from '@/features/resources/schemas/zod/s-resource-api-requests.zod';
import { T_PluginCategory } from '@/features/resources/types/t-plugin-category.type';
import { T_PluginLoader } from '@/features/resources/types/t-plugin-loader.type';
import { C_GameVersions } from '@/lib/configs/c-game-versions.config';
import { T_GameVersion } from '@/lib/types/t-game-version.type';

//The fetch clients use to query search results
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const params = S_ResourceFilterRequestSchema.safeParse({
    query: searchParams.get('q') || undefined,
    categories: searchParams
      .getAll('c')
      .filter((category): category is T_PluginCategory =>
        C_PluginCategories.includes(category as T_PluginCategory),
      ),
    versions: searchParams
      .getAll('v')
      .filter((version): version is T_GameVersion =>
        C_GameVersions.includes(version as T_GameVersion),
      ),
    loaders: searchParams
      .getAll('l')
      .filter((loader): loader is T_PluginLoader =>
        C_PluginLoaders.includes(loader as T_PluginLoader),
      ),

    page: Number.parseInt(searchParams.get('p') || '1', 10),
    limit: Number.parseInt(searchParams.get('limit') || '16', 10),
    type: searchParams.get('type'),
  });

  if (params.success) {
    const result = await resourcesListAllFiltered({
      ...params.data,
    });

    // console.log('Get plugins!', result, 'Params', params.data);
    return NextResponse.json(result);
  } else {
    console.log('Parse error!', params.error);
    return NextResponse.json(
      { error: 'Error could not parse data' },
      { status: 500 },
    );
  }
}
