'use client';

import { getCommands } from '@uiw/react-markdown-editor';
import dynamic from 'next/dynamic';

import { useMarkdown } from '@/components/markdown-editor/context/markdown.context';
import {
  MarkdownAddImageDialog,
  markdownCommandAddImage,
} from '@/components/markdown-editor/markdown-dialog.plugin';

const MarkdownEditorComponent = dynamic(
  () => import('@uiw/react-markdown-editor').then((mod) => mod.default),
  { ssr: false },
);

export default function MarkdownEditor({
  onChange,
}: {
  onChange?: (value: string) => void;
}) {
  const { markdown, setMarkdown, setOpenImage } = useMarkdown();
  return (
    <>
      <MarkdownEditorComponent
        value={markdown}
        onChange={(value) => {
          setMarkdown(value);
          if (onChange) onChange(value);
        }}
        toolbars={[
          ...getCommands().filter((val) => val.name !== 'image'),
          markdownCommandAddImage({ setOpen: setOpenImage }),
        ]}
        className='min-h-96 w-full'
      />
      <MarkdownAddImageDialog />
    </>
  );
}
