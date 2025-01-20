import { Octokit } from '@octokit/rest';
import { NextResponse } from 'next/server';

import { serverEnv } from '@/lib/env/server.env';

const octokit = new Octokit({
  auth: serverEnv.GITHUB_ACCESS_TOKEN,
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path') || '';

  try {
    const response = await octokit.repos.getContent({
      owner: 'RonanPlugins',
      repo: 'RonanHostDocs',
      path: path,
    });

    if (Array.isArray(response.data)) {
      // It's a directory, return the list of files and directories
      const contents = response.data.map((item) => ({
        name: item.name,
        path: item.path,
        type: item.type,
      }));
      return NextResponse.json({ contents });
    } else {
      if (
        response.data.type === 'symlink' ||
        response.data.type === 'submodule'
      )
        return NextResponse.json(
          { error: 'Failed to fetch content, not a file!' },
          { status: 500 },
        );
      // It's a file, return its content
      const content = Buffer.from(response.data.content, 'base64').toString(
        'utf-8',
      );
      return NextResponse.json({ content });
    }
  } catch {
    // console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 },
    );
  }
}
