import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { resourceTable } from '@/lib/db/schema';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ idorslug: string }> },
) {
  const { idorslug } = await params;
  const { searchParams } = new URL(request.url);
  const isDashboard = searchParams.get('dashboard') === 'true';

  try {
    // Check if slug is a resource id
    // Will check via slug by default
    const resource = await db.query.resourceTable.findFirst({
      where: eq(resourceTable.id, idorslug),
    });
    // If found by ID and has a different slug, redirect to the slug URL
    if (resource && resource.slug && resource.slug !== idorslug) {
      const prefix = isDashboard ? '/dashboard' : '';
      const redirectUrl = new URL(
        `${prefix}/plugins/${resource.slug}`,
        request.url,
      );

      return NextResponse.redirect(redirectUrl, 307);
    }

    // If not found by ID or already at the correct URL, return not found
    return NextResponse.json(
      { message: 'Resource not found' },
      { status: 404 },
    );
  } catch (error) {
    console.error('Error checking resource:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
