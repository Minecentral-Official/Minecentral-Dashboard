import { Plate, PlateContent, usePlateEditor } from '@udecode/plate/react';

export default function BasicEditor() {
  const editor = usePlateEditor();

  return (
    <Plate editor={editor}>
      <PlateContent placeholder='Type...' />
    </Plate>
  );
}
