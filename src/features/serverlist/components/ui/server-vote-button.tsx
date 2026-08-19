'use client';

import { useState, useTransition } from 'react';

import { VoteIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import serverVoteForServer from '@/features/serverlist/actions/vote-for-server.action';

export function ServerVoteButton({
  serverId,
  requiresUsername,
}: {
  serverId: string;
  requiresUsername: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [pending, startTransition] = useTransition();

  function vote() {
    startTransition(async () => {
      const result = await serverVoteForServer(serverId, username);
      if (result.success) {
        toast.success(result.message, { id: `vote-${serverId}` });
        setOpen(false);
      } else {
        toast.error(result.message, { id: `vote-${serverId}` });
      }
    });
  }

  if (!requiresUsername) {
    return (
      <Button type='button' size='sm' disabled={pending} onClick={vote}>
        <VoteIcon className='h-4 w-4' />
        Vote
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type='button' size='sm'>
          <VoteIcon className='h-4 w-4' />
          Vote
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Vote for this server</DialogTitle>
        </DialogHeader>
        <div className='flex flex-col gap-3'>
          <Input
            value={username}
            onChange={(event) => setUsername(event.currentTarget.value)}
            placeholder='Minecraft username'
          />
          <Button disabled={pending} onClick={vote}>
            Vote
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
