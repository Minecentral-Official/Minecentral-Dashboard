import { Octokit } from '@octokit/rest';

import { serverEnv } from '@/lib/env/server.env';

const octokit = new Octokit({
  auth: serverEnv.GITHUB_ACCESS_TOKEN,
});

export async function wikiGetFileContent(path: string) {
  try {
    const response = await octokit.repos.getContent({
      owner: 'RonanPlugins',
      repo: 'RonanHostDocs',
      path,
    });

    if (Array.isArray(response.data)) {
      throw new Error('Path is a directory, not a file');
    }

    if ('content' in response.data) {
      return Buffer.from(response.data.content, 'base64').toString('utf-8');
    } else {
      throw new Error('No content found in the response');
    }
  } catch (error) {
    console.error('Error fetching file content:', error);
    return null;
  }
}
