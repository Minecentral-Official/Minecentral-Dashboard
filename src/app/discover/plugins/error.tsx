'use client';

import { Button } from '@/components/ui/button';

export default function CatalogError({ reset }: { reset: () => void }) {
  return (
    <div className='space-y-4 py-12'>
      <h1 className='text-2xl font-semibold'>
        Catalog temporarily unavailable
      </h1>
      <p className='text-muted-foreground'>
        The catalog could not be loaded. Try again in a moment.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
