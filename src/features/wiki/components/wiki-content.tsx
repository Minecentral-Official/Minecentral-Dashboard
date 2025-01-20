import { use } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

import { serverEnv } from '@/lib/env/server.env';

async function fetchWikiContent(path: string) {
  const response = await fetch(
    `${serverEnv.FRONTEND_URL}/api/wiki-content?path=${encodeURIComponent(path)}`,
  );
  if (!response.ok) {
    throw new Error('Failed to fetch wiki content');
  }
  const data = await response.json();
  return data.content;
}

export default function WikiContent({ path }: { path: string }) {
  const content = use(fetchWikiContent(path));

  return (
    <div className='prose max-w-none'>
      <ReactMarkdown
        components={{
          a: ({ href, children }) => {
            if (href?.startsWith('http')) {
              return (
                <a href={href} target='_blank' rel='noopener noreferrer'>
                  {children}
                </a>
              );
            }
            return (
              <Link href={`./?path=${encodeURIComponent(href || '')}`}>
                {children}
              </Link>
            );
          },
          img: ({ src, alt }) => {
            if (src?.startsWith('http')) {
              return <Image src={src || '/placeholder.svg'} alt={alt || ''} />;
            }
            // Assuming images are stored in the same repository
            return (
              <Image
                src={`https://raw.githubusercontent.com/RonanPlugins/RonanHostDocs/main/${src}`}
                alt={alt || ''}
                width={600}
                height={400}
                className='object-contain'
              />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
