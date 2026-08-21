import { PropsWithChildren } from 'react';

import { cn } from '@/lib/utils';

export function DashboardPageShell({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={cn(
        'mx-auto h-full w-full max-w-[1440px] px-4 py-4 sm:px-6 sm:py-6',
        className,
      )}
    >
      {children}
    </div>
  );
}
