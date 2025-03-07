'use client';

import MarkdownEditor from '@uiw/react-markdown-editor';

export default function MarkdownViewer({ markdown }: { markdown: string }) {
  console.log(markdown)
  return (
    <article className='article'>
      <MarkdownEditor.Markdown source={markdown} />
    </article>
  );
}
