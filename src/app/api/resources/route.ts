import { NextRequest, NextResponse } from 'next/server';

import { CategoriesPlugin } from '@/features/resources/config/categories.plugin';
import resourcesGetFiltered from '@/features/resources/queries/resources-filter.get';
import { pluginsGetRequestZod } from '@/features/resources/schemas/zod/plugins-get-request.zod';

import type { T_PluginCategory } from '@/features/resources/config/categories.plugin';

//The fetch clients use to query search results
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const params = pluginsGetRequestZod.safeParse({
    query: searchParams.get('q') || undefined,
    categories: searchParams
      .getAll('category')
      .filter((category): category is T_PluginCategory =>
        CategoriesPlugin.includes(category as T_PluginCategory),
      ),
    page: Number.parseInt(searchParams.get('p') || '0', 10),
    limit: Number.parseInt(searchParams.get('limit') || '10', 10),
  });

  if (params.success) {
    const result = await resourcesGetFiltered({
      ...params.data,
    });

    // console.log('Get plugins!', result, 'Params', params.data);
    return NextResponse.json(result);
  } else {
    // console.log('Parse error!', params.error);
    return NextResponse.json('Error could not parse data', { status: 500 });
  }
}
