'use client';

import { BlockMenuPlugin } from '@udecode/plate-selection/react';

import { blockSelectionPlugins } from '@/components/editor/plugins/block-selection-plugins';
import { BlockContextMenu } from '@/components/plate-ui/block-context-menu';

export const blockMenuPlugins = [
  ...blockSelectionPlugins,
  BlockMenuPlugin.configure({
    render: { aboveEditable: BlockContextMenu },
  }),
] as const;
