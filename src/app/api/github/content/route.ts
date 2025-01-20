import { NextResponse } from 'next/server';
import { Octokit } from 'octokit';

import { serverEnv } from '@/lib/env/server.env';

import type { GitHubFile, MarkdownContent } from '@/lib/types/github';
import type { NextRequest } from 'next/server';

const octokit = new Octokit({
  auth: serverEnv.GITHUB_ACCESS_TOKEN,
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const owner = 'RonanPlugins';
  const repo = 'RonanHostDocs';
  const path = searchParams.get('path');

  if (!owner || !repo || !path) {
    return NextResponse.json(
      { error: 'Owner, repo, and path parameters are required' },
      { status: 400 },
    );
  }

  try {
    const response = await octokit.rest.repos.getContent({
      owner,
      repo,
      path,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    // Handle single file response
    if (Array.isArray(response.data)) {
      return NextResponse.json(
        {
          error: 'Path points to a directory, not a file',
        },
        {
          status: 400,
        },
      );
    }

    const fileData = response.data as GitHubFile;
    if (!fileData.content) {
      throw new Error('No content found in the response');
    }

    const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
    const markdownContent: MarkdownContent = { content };

    return NextResponse.json(markdownContent);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('GitHub API Error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Error fetching file content',
        status: error.status || 500,
      },
      {
        status: error.status || 500,
      },
    );
  }
}
