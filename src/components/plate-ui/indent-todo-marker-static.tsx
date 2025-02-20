import { cn } from '@udecode/cn';

import { CheckboxStatic } from '@/components/plate-ui/checkbox-static';

import type { SlateRenderElementProps } from '@udecode/plate';

export const TodoMarkerStatic = ({
  element,
}: Omit<SlateRenderElementProps, 'children'>) => {
  return (
    <div contentEditable={false}>
      <CheckboxStatic
        className='pointer-events-none absolute -left-6 top-1'
        checked={element.checked as boolean}
      />
    </div>
  );
};

export const TodoLiStatic = ({
  children,
  element,
}: SlateRenderElementProps) => {
  return (
    <li
      className={cn(
        'list-none',
        (element.checked as boolean) && 'text-muted-foreground line-through',
      )}
    >
      {children}
    </li>
  );
};
