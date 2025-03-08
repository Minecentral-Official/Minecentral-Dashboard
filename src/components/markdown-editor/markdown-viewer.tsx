'use client';

import MarkdownPreview from '@uiw/react-markdown-preview';
//Plugin to CLEAR markdown
import rehypeSanitize from 'rehype-sanitize';

export default function MarkdownViewer({ markdown }: { markdown: string }) {
  const rehypePlugins = [rehypeSanitize];
  return (
    <article className='article'>
      <MarkdownPreview
        source={markdown}
        rehypePlugins={rehypePlugins}
        style={{ background: 'none' }}
      />
    </article>
  );
}
