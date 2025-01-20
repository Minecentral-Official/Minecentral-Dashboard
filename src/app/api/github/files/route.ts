import { NextResponse } from 'next/server';
import { Octokit } from 'octokit';

import { serverEnv } from '@/lib/env/server.env';

import type { GitHubApiResponse } from '@/lib/types/github';
import type { NextRequest } from 'next/server';

const octokit = new Octokit({
  auth: serverEnv.GITHUB_ACCESS_TOKEN,
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const owner = 'RonanPlugins';
  const repo = 'RonanHostDocs';
  const path = searchParams.get('path') || '';
  try {
    // Make sure to handle both directory and file responses
    const response = await octokit.rest.repos.getContent({
      owner,
      repo,
      path,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    // If response.data is an array, it's a directory
    const data = Array.isArray(response.data) ? response.data : [response.data];
    const apiResponse: GitHubApiResponse = { data };

    return NextResponse.json(apiResponse);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('GitHub API Error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Error fetching repository contents',
        status: error.status || 500,
      },
      {
        status: error.status || 500,
      },
    );
  }
}
