import { FileExplorer } from '@/features/wiki/components/file-explorer';
import { serverEnv } from '@/lib/env/server.env';

import type { GitHubApiResponse, GitHubContent } from '@/types/github';

async function getContents(): Promise<GitHubContent[]> {
  const res = await fetch(
    `${serverEnv.FRONTEND_URL}/api/github/files?owner=minecental&repo=minecental`,
    {
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
      },
    },
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to fetch repository contents');
  }

  const response: GitHubApiResponse = await res.json();
  return response.data;
}

export default async function Home() {
  let contents: GitHubContent[] = [];
  let error: string | null = null;

  try {
    contents = await getContents();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    error = e.message;
    console.error('Error fetching contents:', e);
  }

  return (
    <div className='mx-auto max-w-4xl px-4 py-8'>
      <h1 className='mb-6 text-3xl font-bold'>Minecental Project Wiki</h1>

      {error ?
        <div className='rounded-md border border-red-200 bg-red-50 p-4 text-red-700'>
          {error}
        </div>
      : contents.length > 0 ?
        <div className='rounded-lg border bg-card p-4'>
          <FileExplorer items={contents} />
        </div>
      : <p className='text-gray-600'>No contents found in the repository.</p>}
    </div>
  );
}
