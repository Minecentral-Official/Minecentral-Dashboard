import { NextResponse } from 'next/server';

import resourceDownloadTick from '@/features/resources/mutations/download-tick.resource';
import resourceGetReleaseById from '@/features/resources/queries/release-by-download-id.get';

import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const downloadId = request.nextUrl.searchParams.get('rId');
  if (!downloadId) {
    return;
  }

  try {
    // Find the file in the database
    const release = await resourceGetReleaseById(downloadId);
    if (!release) {
      return new NextResponse('Invalid release id', { status: 404 });
    }
    //Tick download counter by one
    await resourceDownloadTick(release.id);
    const clientIp = (request.headers.get('x-forwarded-for') || '')
      .split(',')[0]
      .trim();
    console.log(
      'IP Address',
      `'${clientIp}'`,
      'has downloaded the plugin',
      `'${release.plugin.title}'`,
    );

    // Redirect to the actual file URL
    return NextResponse.redirect(release.fileUrl);
  } catch (error) {
    console.error('Error processing download:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
