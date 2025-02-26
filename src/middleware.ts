import { middlewareResources } from '@/app/(public)/resources/[slug]/middleware-resources';

import type { NextRequest } from 'next/server';

export default function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/resources')) {
    middlewareResources(request);
  }
}
