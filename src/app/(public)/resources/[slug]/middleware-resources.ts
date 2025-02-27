import { NextRequest, NextResponse } from 'next/server';

export async function middlewareResources(
  req: NextRequest,
  urlPrefix?: string,
) {
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
