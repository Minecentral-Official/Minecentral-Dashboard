import { NextRequest, NextResponse } from 'next/server';

import { C_CategoriesPlugin } from '@/features/resources/config/plugin-categories.config';
import resourcesListAllFiltered from '@/features/resources/queries/resource-list-all-filter.get';
import { S_ResourceFilterRequestSchema } from '@/features/resources/schemas/zod/s-resource-api-requests.zod';
import { T_PluginCategory } from '@/features/resources/types/t-plugin-category.type';

//The fetch clients use to query search results
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const params = S_ResourceFilterRequestSchema.safeParse({
    query: searchParams.get('q') || undefined,
    categories: searchParams
      .getAll('category')
      .filter((category): category is T_PluginCategory =>
        C_CategoriesPlugin.includes(category as T_PluginCategory),
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
