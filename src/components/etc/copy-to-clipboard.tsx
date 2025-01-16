'use client';

import { type PropsWithChildren } from 'react';

import { Slot } from '@radix-ui/react-slot';
import { Clipboard } from 'lucide-react';
import { toast } from 'sonner';

type CopyToClipboardProps = PropsWithChildren<{
  clipboardText: string;
  asChild?: boolean;
}>;

export default function CopyToClipboard({
  children,
  clipboardText,
  asChild,
}: CopyToClipboardProps) {
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp
      onClick={() => {
        navigator.clipboard.writeText(clipboardText);
        toast('Copied to clipboard', {
          icon: <Clipboard className='h-4 w-4' />,
          id: 'clipboard',
        });
      }}
    >
      {children}
    </Comp>
  );
}
