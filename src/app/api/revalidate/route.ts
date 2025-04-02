import { revalidateTag } from 'next/cache';
import { headers } from 'next/headers';

import { serverEnv } from '@/lib/env/server.env';

export async function POST(request: Request) {
  try {
    // Get the secret from the request headers
    const headersList = await headers();
    const secret = headersList.get('x-revalidate-secret');

    // Check if the secret matches the environment variable
    if (secret !== serverEnv.REVALIDATION_SECRET) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Get the tag from the request body
    const { tag } = await request.json();

    if (!tag) {
      return new Response(JSON.stringify({ error: 'Tag is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Revalidate the tag
    revalidateTag(tag);

    return new Response(
      JSON.stringify({
        revalidated: true,
        tag,
        timestamp: Date.now(),
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (e) {
    console.log(e);
    return new Response(JSON.stringify({ error: 'Failed to revalidate' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
