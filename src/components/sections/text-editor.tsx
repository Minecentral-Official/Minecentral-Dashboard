'use client';

import { useState } from 'react';

import {
  BoldPlugin,
  CodePlugin,
  ItalicPlugin,
  UnderlinePlugin,
} from '@udecode/plate-basic-marks/react';
import { BlockquotePlugin } from '@udecode/plate-block-quote/react';
import { HeadingPlugin } from '@udecode/plate-heading/react';
import { Plate, usePlateEditor } from '@udecode/plate/react';

import { Editor, EditorContainer } from '@/components/plate-ui/editor';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import type { Value } from '@udecode/plate';

const value = [
  {
    type: 'p',
    children: [
      {
        text: 'This is editable plain text with react and history plugins, just like a <textarea>!',
      },
    ],
  },
];

export default function BasicPluginsDefaultDemo() {
  const [debugValue, setDebugValue] = useState<Value>(value);
  const editor = usePlateEditor({
    plugins: [
      BlockquotePlugin,
      HeadingPlugin,
      BoldPlugin,
      ItalicPlugin,
      UnderlinePlugin,
      CodePlugin,
    ],
    value,
  });
  return (
    <Plate
      onChange={({ value }) => {
        setDebugValue(value);
        // save newValue...
      }}
      editor={editor}
    >
      <EditorContainer>
        <Editor />
      </EditorContainer>
      <Accordion type='single' collapsible>
        <AccordionItem value='manual-installation'>
          <AccordionTrigger>Debug Value</AccordionTrigger>
          <AccordionContent>{JSON.stringify(debugValue)}</AccordionContent>
        </AccordionItem>
      </Accordion>
    </Plate>
  );
}
