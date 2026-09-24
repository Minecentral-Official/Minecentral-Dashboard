import { NextRequest, NextResponse } from 'next/server';

import resourcesListAll from '@/features/resources/queries/resource-list-all.get';
import { S_ResourceSimpleRequestSchema } from '@/features/resources/schemas/zod/s-resource-api-requests.zod';
import getSession from '@/lib/auth/helpers/get-session';
import { hasPermission } from '@/lib/auth/helpers/permissions';

//The fetch all resources, for admins
export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!hasPermission(session.user.role, 'resources:moderate'))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const searchParams = request.nextUrl.searchParams;

  const params = S_ResourceSimpleRequestSchema.safeParse({
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
