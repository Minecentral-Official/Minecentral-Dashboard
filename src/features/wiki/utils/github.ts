'use server';

import { Octokit } from '@octokit/rest';

import { serverEnv } from '@/lib/env/server.env';

const octokit = new Octokit({ auth: serverEnv.GITHUB_ACCESS_TOKEN });

export async function fetchMarkdownContent(path: string) {
  try {
    const response = await octokit.repos.getContent({
      owner: 'RonanPlugins',
      repo: 'RonanHostDocs',
      path,
    });

    if (Array.isArray(response.data)) {
      throw new Error('Path is a directory, not a file');
    }

    if (response.data.type !== 'file') {
      throw new Error('Path does not point to a file');
    }

    const content = Buffer.from(response.data.content, 'base64').toString(
      'utf-8',
    );
    return content;
  } catch (error) {
    console.error('Error fetching Markdown content:', error);
    return null;
  }
}
