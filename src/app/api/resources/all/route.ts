import { NextRequest, NextResponse } from 'next/server';

import resourcesListAll from '@/features/resources/queries/resource-list-all.get';
import { resourcesListFilterApiRequestZod } from '@/features/resources/schemas/zod/resources-list-filter-api.zod';

//The fetch all resources, for admins
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const params = resourcesListFilterApiRequestZod.safeParse({
    page: Number.parseInt(searchParams.get('p') || '0', 10),
    limit: Number.parseInt(searchParams.get('limit') || '10', 10),
  });

  if (params.success) {
    const result = await resourcesListAll({
      ...params.data,
    });

    // console.log('Get plugins!', result, 'Params', params.data);
    return NextResponse.json(result);
  } else {
    // console.log('Parse error!', params.error);
    return NextResponse.json('Error could not parse data', { status: 500 });
  }
}
