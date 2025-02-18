import { NextRequest, NextResponse } from 'next/server';

import { TPluginCategories } from '@/features/resource-plugin/config/categories.plugin';
import pluginsGet from '@/features/resource-plugin/queries/resources-find.filter';
import { PluginsGetRequestSchema } from '@/features/resource-plugin/schemas/zod/plugins-get-request.zod';

import type { TPluginCategory } from '@/features/resource-plugin/config/categories.plugin';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const params = PluginsGetRequestSchema.safeParse({
    query: searchParams.get('q') || undefined,
    categories: searchParams
      .getAll('category')
      .filter((category): category is TPluginCategory =>
        TPluginCategories.includes(category as TPluginCategory),
      ),
    page: Number.parseInt(searchParams.get('p') || '0', 10),
    limit: Number.parseInt(searchParams.get('limit') || '10', 10),
  });

  if (params.success) {
    const result = await pluginsGet({
      ...params.data,
    });

    // console.log('Get plugins!', result, 'Params', params.data);
    return NextResponse.json(result);
  } else {
    // console.log('Parse error!', params.error);
    return NextResponse.json('Error could not parse data', { status: 500 });
  }
}
