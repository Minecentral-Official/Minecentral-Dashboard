import { middlewareResources } from '@/app/(public)/resources/[slug]/middleware-resources';

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
