'use client';

import MarkdownPreview from '@uiw/react-markdown-preview';
import rehypeRaw from 'rehype-raw';
//Plugin to CLEAR markdown
import rehypeSanitize from 'rehype-sanitize';

import { validateSurroundingText } from '@/components/markdown-editor/markdown-editor';

export default function MarkdownViewer({ markdown }: { markdown: string }) {
  const rehypePlugins = [rehypeSanitize, rehypeRaw];
  return (
    <article className='article'>
      <MarkdownPreview
        source={markdown}
        rehypePlugins={rehypePlugins}
        style={{ background: 'none' }}
        components={{
          a: ({ children, ...props }) => {
            return validateSurroundingText(children, props.href, true) ?
                <iframe
                  src={props.href}
                  className='mx-auto aspect-video w-auto min-w-[400px]'
                />
              : <a {...props}>{children}</a>;
          },

          img: ({ ...props }) => (
            // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
            <img {...props} style={{ background: 'none' }} />
          ),
        }}
      />
    </article>
  );
}
