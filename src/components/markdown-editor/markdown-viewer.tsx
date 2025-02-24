'use client';

import MarkdownEditor from '@uiw/react-markdown-editor';

export default function MarkdownViewer({ markdown }: { markdown: string }) {
  return (
    <article className='article container'>
      <MarkdownEditor.Markdown source={markdown} />
    </article>
  );
}
