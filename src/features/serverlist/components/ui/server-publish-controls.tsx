'use client';

import { useTransition } from 'react';

import { EyeOffIcon, RocketIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  serverPublishAction,
  serverUnpublishAction,
} from '@/features/serverlist/actions/publish-server.action';

export function ServerPublishControls({
  serverId,
  status,
  ready,
}: {
  serverId: string;
  status: 'draft' | 'published';
  ready: boolean;
}) {
  const [pending, startTransition] = useTransition();

  function run(action: () => Promise<{ success: boolean; message: string }>) {
    startTransition(async () => {
      const result = await action();
      if (result.success) toast.success(result.message, { id: 'server-status' });
      else toast.error(result.message, { id: 'server-status' });
    });
  }

  if (status === 'published') {
    return (
      <Button
        type='button'
        variant='outline'
        disabled={pending}
        onClick={() => run(() => serverUnpublishAction(serverId))}
      >
        <EyeOffIcon className='h-4 w-4' />
        Unpublish
      </Button>
    );
  }

  return (
    <Button
      type='button'
      disabled={!ready || pending}
      onClick={() => run(() => serverPublishAction(serverId))}
    >
      <RocketIcon className='h-4 w-4' />
      Publish
    </Button>
  );
}
