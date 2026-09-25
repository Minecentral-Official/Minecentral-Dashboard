import Link from 'next/link';

import type { ReactNode } from 'react';

export default function CatalogLayout({ children }: { children: ReactNode }) {
  return (
    <div className='mx-auto min-h-screen max-w-6xl px-4 py-8 sm:px-8'>
      <header className='mb-10 flex flex-wrap items-center justify-between gap-4 border-b pb-5'>
        <Link href='/discover/plugins' className='text-lg font-semibold'>
          MineCentral{' '}
          <span className='font-normal text-muted-foreground'>
            / Plugin catalog
          </span>
        </Link>
        <Link
          href='/servers'
          className='text-sm text-primary underline underline-offset-4'
        >
          My Servers →
        </Link>
      </header>
      {children}
    </div>
  );
}
