'use client';

import { useActionState, useEffect } from 'react';

import { TrashIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import serverDeleteAction from '@/features/serverlist/actions/delete-server.action';

export function ServerDeleteForm({
  serverId,
  title,
}: {
  serverId: string;
  title: string;
}) {
  const [state, action] = useActionState(serverDeleteAction, undefined);

  useEffect(() => {
    if (state?.success === false) toast.error(state.message, { id: 'delete-server' });
  }, [state]);

  return (
    <form action={action} className='flex flex-col gap-3'>
      <input type='hidden' name='id' value={serverId} />
      <p className='text-sm text-muted-foreground'>
        Type <span className='font-semibold text-foreground'>{title}</span> to
        confirm deletion.
      </p>
      <Input name='confirmation' placeholder={title} />
      <Button variant='destructive'>
        <TrashIcon className='h-4 w-4' />
        Delete listing
      </Button>
    </form>
  );
}
