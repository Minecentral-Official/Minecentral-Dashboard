'use client';

import { useActionState } from 'react';

import { Button } from '@/components/ui/button';
import { catalogAction } from '@/features/catalog/actions/catalog.actions';

import type { ReactNode } from 'react';

export default function CatalogForm({
  operation,
  label,
  children,
}: {
  operation: string;
  label: string;
  children: ReactNode;
}) {
  const [state, action, pending] = useActionState(catalogAction, {});
  return (
    <form action={action} className='space-y-3'>
      <input type='hidden' name='operation' value={operation} />
      {state.error && (
        <p role='alert' className='text-destructive'>
          {state.error}
        </p>
      )}
      {state.message && <p role='status'>{state.message}</p>}
      <fieldset disabled={pending} className='space-y-3'>
        {children}
        <Button type='submit'>{pending ? 'Saving…' : label}</Button>
      </fieldset>
    </form>
  );
}
