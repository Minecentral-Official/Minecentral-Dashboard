'use client';

import React from 'react';

import '@uiw/react-markdown-preview/markdown.css';
import '@uiw/react-md-editor/markdown-editor.css';

import { codeEdit, codeLive, getCommands } from '@uiw/react-md-editor';
import { TriangleAlertIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

import { useMarkdown } from '@/components/markdown-editor/context/markdown.context';
import {
  MarkdownAddImageDialog,
  markdownCommandAddImage,
} from '@/components/markdown-editor/markdown-dialog.plugin';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

//Tutorial on how I leanrt to make safe youtube embeds
// https://ttoss.dev/blog/2023/09/28/embedding-videos-in-markdown-using-react
export default function MarkdownEditor({
  onChange,
}: {
  onChange: (val: string) => void;
}) {
  const { markdown, setMarkdown, setOpenImage } = useMarkdown();
  return (
    <>
      <MDEditor
        height={'100%'}
        value={markdown}
        onChange={(e) => {
          setMarkdown(e || '');
          onChange(e || '');
        }}
        commands={[
          ...getCommands(),
          markdownCommandAddImage({ setOpen: setOpenImage }),
        ]}
        style={{
          background: 'none',
          borderRadius: '10px',
          boxShadow: 'none',
          margin: '0px',
        }}
        extraCommands={[codeLive, codeEdit]}
        previewOptions={{
          rehypePlugins: [rehypeSanitize, rehypeRaw],
          style: { background: 'none' },
          components: {
            a: ({ children, ...props }) => {
              return validateSurroundingText(children, props.href, true) ?
                  <iframe src={props.href} />
                : <a {...props}>{children}</a>;
            },
          },
        }}
      />
      <MarkdownAddImageDialog />
      <p className='flex items-center gap-1 text-sm font-extralight'>
        <TriangleAlertIcon className='h-4 w-4' />
        {`This editor supports `}
        <Link
          className='text-primary hover:cursor-pointer hover:underline'
          href={'https://www.markdownguide.org/basic-syntax/'}
        >
          Markdown formatting
        </Link>
      </p>
    </>
  );
}

/**
 * 
 * if (
                ['youtube', 'embed'].every((item) => props.href?.includes(item))
              ) {
                return <iframe src={props.href} />;
              } else return <a {...props} />;

*/
function validateSurroundingText(
  children: React.ReactNode,
  href: string | undefined,
  checkYouTube?: boolean,
) {
  if (href === undefined) return false;
  // const text = React.Children.toArray(children)
  //   .map((child) => (typeof child === 'string' ? child : ''))
  //   .join('');

  // Regex to check for [SOMETEXT] (<a>...</a>)
  let regex = /\[\S+?\]\(\s*<a[^>]*>(.*?)<\/a>\s*\)/;

  if (checkYouTube) {
    regex = /(https?:\/\/(?:www\.)?youtube\.com\/embed\/[a-zA-Z0-9_-]+)/;
  }

  return regex.test(href);
}
