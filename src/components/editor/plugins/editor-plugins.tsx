'use client';

import { CalloutPlugin } from '@udecode/plate-callout/react';
import { DatePlugin } from '@udecode/plate-date/react';
import { DocxPlugin } from '@udecode/plate-docx';
import {
  FontBackgroundColorPlugin,
  FontColorPlugin,
  FontSizePlugin,
} from '@udecode/plate-font/react';
import { HorizontalRulePlugin } from '@udecode/plate-horizontal-rule/react';
import { JuicePlugin } from '@udecode/plate-juice';
import { KbdPlugin } from '@udecode/plate-kbd/react';
import { ColumnPlugin } from '@udecode/plate-layout/react';
import { MarkdownPlugin } from '@udecode/plate-markdown';
import { SlashPlugin } from '@udecode/plate-slash-command/react';
import { TogglePlugin } from '@udecode/plate-toggle/react';
import { TrailingBlockPlugin } from '@udecode/plate-trailing-block';

import { alignPlugin } from '@/components/editor/plugins/align-plugin';
import { autoformatPlugin } from '@/components/editor/plugins/autoformat-plugin';
import { basicNodesPlugins } from '@/components/editor/plugins/basic-nodes-plugins';
import { blockMenuPlugins } from '@/components/editor/plugins/block-menu-plugins';
import { cursorOverlayPlugin } from '@/components/editor/plugins/cursor-overlay-plugin';
import { deletePlugins } from '@/components/editor/plugins/delete-plugins';
import { exitBreakPlugin } from '@/components/editor/plugins/exit-break-plugin';
import { FixedToolbarPlugin } from '@/components/editor/plugins/fixed-toolbar-plugin';
import { FloatingToolbarPlugin } from '@/components/editor/plugins/floating-toolbar-plugin';
import { indentListPlugins } from '@/components/editor/plugins/indent-list-plugins';
import { lineHeightPlugin } from '@/components/editor/plugins/line-height-plugin';
import { linkPlugin } from '@/components/editor/plugins/link-plugin';
import { mediaPlugins } from '@/components/editor/plugins/media-plugins';
import { mentionPlugin } from '@/components/editor/plugins/mention-plugin';
import { resetBlockTypePlugin } from '@/components/editor/plugins/reset-block-type-plugin';
import { softBreakPlugin } from '@/components/editor/plugins/soft-break-plugin';
import { tablePlugin } from '@/components/editor/plugins/table-plugin';
import { tocPlugin } from '@/components/editor/plugins/toc-plugin';

export const viewPlugins = [
  ...basicNodesPlugins,
  HorizontalRulePlugin,
  linkPlugin,
  DatePlugin,
  mentionPlugin,
  tablePlugin,
  TogglePlugin,
  tocPlugin,
  ...mediaPlugins,
  CalloutPlugin,
  ColumnPlugin,

  // Marks
  FontColorPlugin,
  FontBackgroundColorPlugin,
  FontSizePlugin,
  KbdPlugin,

  // Block Style
  alignPlugin,
  ...indentListPlugins,
  lineHeightPlugin,
] as const;

export const editorPlugins = [
  // Nodes
  ...viewPlugins,

  // Functionality
  SlashPlugin,
  autoformatPlugin,
  cursorOverlayPlugin,
  ...blockMenuPlugins,
  // ...dndPlugins,
  // EmojiPlugin.configure({ options: { data: emojiMartData as any } }),
  exitBreakPlugin,
  resetBlockTypePlugin,
  ...deletePlugins,
  softBreakPlugin,
  TrailingBlockPlugin,

  // Deserialization
  DocxPlugin,
  MarkdownPlugin.configure({ options: { indentList: true } }),
  JuicePlugin,

  // UI
  FixedToolbarPlugin,
  FloatingToolbarPlugin,
];
