'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function WorkspaceError({ reset }: { reset: () => void }) {
  return (
    <div role='alert' className='space-y-4 rounded-lg border p-6'>
      <h2 className='text-xl font-semibold'>
        Your workspace could not be loaded
      </h2>
      <p className='text-muted-foreground'>
        Try again. If this keeps happening, check that your session is still
        active.
      </p>
      <div className='flex gap-3'>
        <Button onClick={reset}>Try again</Button>
        <Button asChild variant='outline'>
          <Link href='/sign-in'>Sign in</Link>
        </Button>
      </div>
    </div>
  );
}
