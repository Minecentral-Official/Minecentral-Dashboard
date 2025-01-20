import matter from 'gray-matter';
import { NextResponse } from 'next/server';
import { Octokit } from 'octokit';
import { remark } from 'remark';
import html from 'remark-html';

import { serverEnv } from '@/lib/env/server.env';

import type { NextRequest } from 'next/server';

const octokit = new Octokit({ auth: serverEnv.GITHUB_ACCESS_TOKEN });

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const owner = searchParams.get('owner');
  const repo = searchParams.get('repo');
  const path = searchParams.get('path');

  if (!owner || !repo || !path) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 },
    );
  }

  try {
    const response = await octokit.request(
      'GET /repos/{owner}/{repo}/contents/{path}',
      {
        owner,
        repo,
        path,
      },
    );

    const content = Buffer.from(response.data.content, 'base64').toString(
      'utf-8',
    );
    const { data, content: markdown } = matter(content);

    const processedContent = await remark().use(html).process(markdown);
    const contentHtml = processedContent.toString();

    return NextResponse.json({ data, contentHtml });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching wiki content' },
      { status: 500 },
    );
  }
}
