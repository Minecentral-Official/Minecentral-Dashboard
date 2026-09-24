import { NextResponse } from 'next/server';

import resourceDownloadTick from '@/features/resources/mutations/download-tick.resource';
import { projectGetById } from '@/features/resources/queries/project-by-id.get';
import resourceGetReleaseByResourceId from '@/features/resources/queries/release-by-download-id.get';

import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const downloadId = request.nextUrl.searchParams.get('rId');
  if (!downloadId) {
    return new NextResponse('Missing release id', { status: 400 });
  }

  try {
    // Find the file in the database
    const release = await resourceGetReleaseByResourceId(downloadId);
    if (!release || !(await projectGetById(release.pluginId))) {
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
