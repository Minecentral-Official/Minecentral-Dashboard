'use client';

import {
  BoldPlugin,
  CodePlugin,
  ItalicPlugin,
  StrikethroughPlugin,
  UnderlinePlugin,
} from '@udecode/plate-basic-marks/react';
import {
  FontBackgroundColorPlugin,
  FontColorPlugin,
} from '@udecode/plate-font/react';
import { ImagePlugin, VideoPlugin } from '@udecode/plate-media/react';
import { useEditorReadOnly } from '@udecode/plate/react';
import {
  BaselineIcon,
  BoldIcon,
  Code2Icon,
  ItalicIcon,
  MoreHorizontalIcon,
  PaintBucketIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from 'lucide-react';

import { AlignDropdownMenu } from '@/components/plate-ui/align-dropdown-menu';
import { ColorDropdownMenu } from '@/components/plate-ui/color-dropdown-menu';
import { FontSizeToolbarButton } from '@/components/plate-ui/font-size-toolbar-button';
import {
  RedoToolbarButton,
  UndoToolbarButton,
} from '@/components/plate-ui/history-toolbar-button';
import {
  BulletedIndentListToolbarButton,
  NumberedIndentListToolbarButton,
} from '@/components/plate-ui/indent-list-toolbar-button';
import { IndentTodoToolbarButton } from '@/components/plate-ui/indent-todo-toolbar-button';
import { IndentToolbarButton } from '@/components/plate-ui/indent-toolbar-button';
import { InsertDropdownMenu } from '@/components/plate-ui/insert-dropdown-menu';
import { LinkToolbarButton } from '@/components/plate-ui/link-toolbar-button';
import { MarkToolbarButton } from '@/components/plate-ui/mark-toolbar-button';
import { MediaToolbarButton } from '@/components/plate-ui/media-toolbar-button';
import { ModeDropdownMenu } from '@/components/plate-ui/mode-dropdown-menu';
import { OutdentToolbarButton } from '@/components/plate-ui/outdent-toolbar-button';
import { TableDropdownMenu } from '@/components/plate-ui/table-dropdown-menu';
import { ToolbarGroup } from '@/components/plate-ui/toolbar';
import { TurnIntoDropdownMenu } from '@/components/plate-ui/turn-into-dropdown-menu';

export function FixedToolbarButtons() {
  const readOnly = useEditorReadOnly();

  const mainToolbarItems = (
    <>
      <ToolbarGroup>
        <UndoToolbarButton />
        <RedoToolbarButton />
      </ToolbarGroup>

      <ToolbarGroup>
        <InsertDropdownMenu />
        <TurnIntoDropdownMenu />
        <FontSizeToolbarButton />
      </ToolbarGroup>

      <ToolbarGroup>
        <MarkToolbarButton nodeType={BoldPlugin.key} tooltip='Bold (ctrl+B)'>
          <BoldIcon className='h-4 w-4' />
        </MarkToolbarButton>

        <MarkToolbarButton
          nodeType={ItalicPlugin.key}
          tooltip='Italic (ctrl+I)'
        >
          <ItalicIcon className='h-4 w-4' />
        </MarkToolbarButton>

        <MarkToolbarButton
          nodeType={UnderlinePlugin.key}
          tooltip='Underline (ctrl+U)'
        >
          <UnderlineIcon className='h-4 w-4' />
        </MarkToolbarButton>
      </ToolbarGroup>
    </>
  );

  const secondaryToolbarItems = (
    <>
      <ToolbarGroup>
        <MarkToolbarButton
          nodeType={StrikethroughPlugin.key}
          tooltip='Strikethrough'
        >
          <StrikethroughIcon className='h-4 w-4' />
        </MarkToolbarButton>

        <MarkToolbarButton nodeType={CodePlugin.key} tooltip='Code (ctrl+E)'>
          <Code2Icon className='h-4 w-4' />
        </MarkToolbarButton>

        <ColorDropdownMenu nodeType={FontColorPlugin.key} tooltip='Text color'>
          <BaselineIcon className='h-4 w-4' />
        </ColorDropdownMenu>

        <ColorDropdownMenu
          nodeType={FontBackgroundColorPlugin.key}
          tooltip='Background color'
        >
          <PaintBucketIcon className='h-4 w-4' />
        </ColorDropdownMenu>
      </ToolbarGroup>

      <ToolbarGroup>
        <AlignDropdownMenu />
        <NumberedIndentListToolbarButton />
        <BulletedIndentListToolbarButton />
        <IndentTodoToolbarButton />
      </ToolbarGroup>

      <ToolbarGroup>
        <LinkToolbarButton />
        <TableDropdownMenu />
      </ToolbarGroup>

      <ToolbarGroup>
        <MediaToolbarButton nodeType={ImagePlugin.key} />
        <MediaToolbarButton nodeType={VideoPlugin.key} />
      </ToolbarGroup>

      <ToolbarGroup>
        <OutdentToolbarButton />
        <IndentToolbarButton />
      </ToolbarGroup>
    </>
  );

  return (
    <div className='flex w-full flex-wrap items-center gap-2'>
      {!readOnly && (
        <>
          <div className='flex flex-wrap items-center gap-2'>
            {mainToolbarItems}
          </div>
          <div className='hidden flex-wrap items-center gap-2 xl:flex'>
            {secondaryToolbarItems}
          </div>
          <div className='xl:hidden'>
            <MoreHorizontalIcon>{secondaryToolbarItems}</MoreHorizontalIcon>
          </div>
        </>
      )}

      <div className='grow' />

      <ToolbarGroup>
        <ModeDropdownMenu />
      </ToolbarGroup>
    </div>
  );
}
