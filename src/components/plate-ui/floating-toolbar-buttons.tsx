'use client';

import {
  BoldPlugin,
  CodePlugin,
  ItalicPlugin,
  StrikethroughPlugin,
  UnderlinePlugin,
} from '@udecode/plate-basic-marks/react';
import { useEditorReadOnly } from '@udecode/plate/react';
import {
  BoldIcon,
  Code2Icon,
  ItalicIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from 'lucide-react';

import { LinkToolbarButton } from '@/components/plate-ui/link-toolbar-button';
import { MarkToolbarButton } from '@/components/plate-ui/mark-toolbar-button';
import { TurnIntoDropdownMenu } from '@/components/plate-ui/turn-into-dropdown-menu';

export function FloatingToolbarButtons() {
  const readOnly = useEditorReadOnly();

  return (
    <>
      {!readOnly && (
        <>
          <TurnIntoDropdownMenu />

          <MarkToolbarButton nodeType={BoldPlugin.key} tooltip='Bold (ctrl+B)'>
            <BoldIcon />
          </MarkToolbarButton>

          <MarkToolbarButton
            nodeType={ItalicPlugin.key}
            tooltip='Italic (ctrl+I)'
          >
            <ItalicIcon />
          </MarkToolbarButton>

          <MarkToolbarButton
            nodeType={UnderlinePlugin.key}
            tooltip='Underline (ctrl+U)'
          >
            <UnderlineIcon />
          </MarkToolbarButton>

          <MarkToolbarButton
            nodeType={StrikethroughPlugin.key}
            tooltip='Strikethrough'
          >
            <StrikethroughIcon />
          </MarkToolbarButton>

          <MarkToolbarButton nodeType={CodePlugin.key} tooltip='Code (ctrl+E)'>
            <Code2Icon />
          </MarkToolbarButton>

          <LinkToolbarButton />
        </>
      )}
    </>
  );
}
