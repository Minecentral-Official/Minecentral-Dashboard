'use client';

import * as React from 'react';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { CheckIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

const CustomCheckbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, children, checked, ...props }, ref) => {
  // const [checked, setChecked] = React.useState(false);

  const handleCheck = (checked: boolean) => {
    // setChecked(checked);
    if (props.onCheckedChange) props.onCheckedChange(checked);
  };

  //   const handleDelete = (e: React.MouseEvent) => {
  //     e.stopPropagation();
  //     setChecked(false);
  //     if (props.onCheckedChange) props.onCheckedChange(false);
  //   };

  //   const [isHoveringBox, setIsHoveringBox] = React.useState(false);
  const [isHoveringButton, setIsHoveringButton] = React.useState(false);

  return (
    <div className='flex items-center space-x-2'>
      <CheckboxPrimitive.Root
        ref={ref}
        // onMouseEnter={() => setIsHoveringBox(true)}
        // onMouseLeave={() => setIsHoveringBox(false)}
        className={cn('w-full focus-visible:ring-ring', className)}
        checked={checked}
        onCheckedChange={handleCheck}
        {...props}
      >
        <div className='flex items-center'>
          <div
            className={cn(
              'inline-flex h-6 w-full items-center justify-between rounded-lg px-2 text-sm font-medium transition-colors duration-200 ease-in-out',
              checked ?
                'bg-primary/90 text-primary-foreground hover:bg-primary'
              : 'text-foreground hover:bg-accent',
            )}
            onMouseEnter={() => setIsHoveringButton(true)}
            onMouseLeave={() => setIsHoveringButton(false)}
          >
            <div className='flex flex-row items-center'>{children}</div>
            <CheckIcon
              className={`h-4 w-4 transition-opacity duration-200 ease-in-out ${isHoveringButton || checked ? 'opacity-100' : 'opacity-0'}`}
            />
          </div>
          {/* <div
            className={`inline-flex h-8 w-10 items-center justify-center rounded-full hover:bg-accent hover:text-red-400 ${isHoveringBox ? 'opacity-100' : 'opacity-0'}`}
            onClick={handleDelete}
          >
            <CircleSlashedIcon className='h-4 w-4' />
          </div> */}
        </div>
      </CheckboxPrimitive.Root>
    </div>
  );
});
CustomCheckbox.displayName = 'CustomCheckbox';

export { CustomCheckbox };
