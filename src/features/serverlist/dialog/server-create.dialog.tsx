'use client';

import { PropsWithChildren, useState } from 'react';

import { DialogDescription } from '@radix-ui/react-dialog';
import { AlertTriangleIcon } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import ServerCreateForm from '@/features/serverlist/components/forms/create-project.form';

export function ServerCreateDialog({
  children,
  className,
}: PropsWithChildren & { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className={className}>{children}</div>
      </DialogTrigger>
      <DialogContent className='max-w-screen-sm'>
        <DialogHeader>
          <DialogTitle>Create my Realm</DialogTitle>
          <DialogDescription className='flex flex-row items-center'>
            <AlertTriangleIcon className='mr-1 h-4 w-4' />
            This will be your one and only realm you can create, use it wisely!
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div className='mt-2 flex w-full flex-row gap-4'>
          <ServerCreateForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}
