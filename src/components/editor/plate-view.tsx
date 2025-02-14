'use client';

import { Value } from '@udecode/plate';
import { Plate, PlateEditor as PlateEditorUdecode } from '@udecode/plate/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { useCreateViewer } from '@/components/editor/use-create-viewer';
import { Editor, EditorContainer } from '@/components/plate-ui/editor';
import { Card } from '@/components/ui/card';

export function PlateViewer({
  content,
}: {
  content: string | Value | ((editor: PlateEditorUdecode) => Value) | undefined;
}) {
  const editor = useCreateViewer(content);

  return (
    <Card>
      <DndProvider backend={HTML5Backend}>
        <Plate editor={editor} readOnly={true}>
          <EditorContainer>
            <Editor variant='default' />
          </EditorContainer>
        </Plate>
      </DndProvider>
    </Card>
  );
}
