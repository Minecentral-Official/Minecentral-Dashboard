import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

export default function middleware(request: NextRequest) {
  //These two statements will take in a resources ID or url SLUG, and only allow SLUG to pass
  // else it will fetch resource by their id, and redirect them to resources SLUG url
  if (request.nextUrl.pathname.startsWith('/resources/')) {
    return middlewareResources(request);
  } else if (request.nextUrl.pathname.startsWith('/dashboard/resources/')) {
    return middlewareResources(request, '/dashboard');
  }
}

async function middlewareResources(req: NextRequest, urlPrefix?: string) {
  const { pathname } = req.nextUrl;
  const pathArray = pathname.split('/');

  if (pathArray) {
    const slug = pathArray[pathArray.length - 1];

    // Fetch resource from DB by slug or ID

    return await fetch(`${req.nextUrl.origin}/api/resources/${slug}`)
      .then(async (res) => {
        return res.json();
      })
      .then((data) => {
        if (data.slug) {
          const correctUrl = `${urlPrefix || ''}/resources/${data.slug}`;
          if (pathname !== correctUrl) {
            const url = req.nextUrl.clone();
            url.pathname = correctUrl;
            return NextResponse.redirect(url, 307);
          }
        }
        return NextResponse.next();
      });
  }

  return NextResponse.next();
}
