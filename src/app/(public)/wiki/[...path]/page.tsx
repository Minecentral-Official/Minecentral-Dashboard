import { MDXRemote } from 'next-mdx-remote/rsc';

import { wikiGetFileContent } from '@/features/wiki/queries/file-content.get';

export default async function GitHubMDXPage({
  params,
}: {
  params: Promise<{ path: string[] }>;
}) {
  const { path } = await params;
  const filePath = path.join('/');
  const content = await wikiGetFileContent(filePath);

  if (!content) {
    return <div>Error: Could not fetch file content</div>;
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='mb-4 text-2xl font-bold'>{filePath}</h1>
      <div className='prose'>
        <MDXRemote source={content} />
      </div>
    </div>
  );
}
