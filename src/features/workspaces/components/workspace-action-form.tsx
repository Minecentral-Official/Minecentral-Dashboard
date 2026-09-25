'use client';

import { useActionState } from 'react';

import { Button } from '@/components/ui/button';

import type { WorkspaceFormAction } from '@/features/workspaces/schemas/workspace-form-state';
import type { ReactNode } from 'react';

export default function WorkspaceActionForm({
  action,
  label,
  children,
  destructive = false,
}: {
  action: WorkspaceFormAction;
  label: string;
  children?: ReactNode;
  destructive?: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  return (
    <form action={formAction} className='space-y-3'>
      {state.error && (
        <p role='alert' className='text-sm text-destructive'>
          {state.error}
        </p>
      )}
      {state.fields && (
        <ul className='text-sm text-destructive'>
          {Object.entries(state.fields).map(([field, message]) => (
            <li key={field}>{message}</li>
          ))}
        </ul>
      )}
      {state.message && (
        <p role='status' className='text-sm text-primary'>
          {state.message}
        </p>
      )}
      <fieldset disabled={pending} className='space-y-3'>
        {children}
        <Button
          type='submit'
          variant={destructive ? 'destructive' : 'outline'}
          size='sm'
        >
          {pending ? 'Saving…' : label}
        </Button>
      </fieldset>
    </form>
  );
}
