'use server';

import { Octokit } from '@octokit/rest';

import { serverEnv } from '@/lib/env/server.env';

const octokit = new Octokit({
  auth: serverEnv.GITHUB_ACCESS_TOKEN,
});

export async function wikiGetFolderContent(path: string) {
  try {
    const response = await octokit.repos.getContent({
      owner: 'RonanPlugins',
      repo: 'RonanHostDocs',
      path: path,
    });

    if (Array.isArray(response.data)) {
      // It's a directory, return the list of files and directories
      const contents = response.data.map((item) => {
        if (item.type !== 'dir' && item.type !== 'file') return {};
        return {
          name: item.name,
          path: item.path,
          type: item.type,
        };
      });
      return contents.filter((content) => content.name !== undefined);
    } else return null;
  } catch {
    // console.error('Error fetching content:', error);
    return null;
  }
}
