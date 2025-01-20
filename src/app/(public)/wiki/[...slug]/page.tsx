import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

import { serverEnv } from '@/lib/env/server.env';

import type { MarkdownContent } from '@/lib/types/github';

async function getMarkdownContent(path: string): Promise<MarkdownContent> {
  const res = await fetch(
    `${serverEnv.FRONTEND_URL}/api/github/content?path=${path}`,
    { cache: 'no-store' },
  );

  if (!res.ok) {
    throw new Error('Failed to fetch markdown content');
  }

  return res.json();
}

export default async function WikiPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const path = (await params).slug.join('/');
  let markdownContent: MarkdownContent;

  try {
    markdownContent = await getMarkdownContent(path);
  } catch {
    notFound();
  }

  // Create breadcrumb items
  const breadcrumbs = slug.map((item, index) => ({
    name: item,
    path: `/wiki/${slug.slice(0, index + 1).join('/')}`,
  }));

  return (
    <div className='mx-auto max-w-4xl px-4 py-8'>
      {/* Breadcrumb navigation */}
      <nav className='mb-6 flex items-center space-x-2 text-sm text-muted-foreground'>
        <Link href='/' className='hover:text-foreground'>
          Home
        </Link>
        {breadcrumbs.map((item, index) => (
          <span key={item.path} className='flex items-center space-x-2'>
            <ChevronRight className='h-4 w-4' />
            <Link href={item.path} className='hover:text-foreground'>
              {item.name}
            </Link>
          </span>
        ))}
      </nav>

      <div className='prose dark:prose-invert max-w-none'>
        <ReactMarkdown>{markdownContent.content}</ReactMarkdown>
      </div>
    </div>
  );
}
