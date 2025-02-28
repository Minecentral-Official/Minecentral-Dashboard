import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { resourceTable } from '@/lib/db/schema';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  // Check if it's a numeric ID
  let resource = await db.query.resourceTable.findFirst({
    where: eq(resourceTable.id, slug),
  });
  if (!resource)
    resource = await db.query.resourceTable.findFirst({
      where: eq(resourceTable.slug, slug),
    });

  if (!resource)
    return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json(resource);
}
