import { cn } from '@/lib/utils';

import type { ComponentProps } from 'react';

export const Field = ({
  children,
  className,
}: { children: React.ReactNode } & ComponentProps<'div'>) => {
  return <div className={cn('flex flex-col gap-2', className)}>{children}</div>;
};

export const FieldError = ({ children }: { children: React.ReactNode }) => {
  return <div className='text-sm text-red-600'>{children}</div>;
};
