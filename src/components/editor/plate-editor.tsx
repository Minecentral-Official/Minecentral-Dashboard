'use client';

import { Plate } from '@udecode/plate/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { useCreateEditor } from '@/components/editor/use-create-editor';
import { Editor, EditorContainer } from '@/components/plate-ui/editor';
import { Card } from '@/components/ui/card';

export function PlateEditor({
  content,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
}) {
  const editor = useCreateEditor(content);

  return (
    <Card>
      <DndProvider backend={HTML5Backend}>
        <Plate
          editor={editor}
          onChange={({ value }) =>
            window.localStorage.setItem('editorContent', JSON.stringify(value))
          }
        >
          <EditorContainer>
            <Editor variant='default' />
          </EditorContainer>
        </Plate>
      </DndProvider>
    </Card>
  );
}
