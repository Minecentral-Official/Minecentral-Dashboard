import { Value } from '@udecode/plate';
import { PlateEditor, usePlateEditor } from '@udecode/plate/react';

import { viewPlugins } from '@/components/editor/plugins/editor-plugins';
import { plateComponents } from '@/components/editor/use-create-editor';

export const useCreateViewer = (
  value: string | Value | ((editor: PlateEditor) => Value) | undefined,
) => {
  return usePlateEditor({
    override: {
      components: plateComponents,
    },
    plugins: [...viewPlugins],
    value,
  });
};
