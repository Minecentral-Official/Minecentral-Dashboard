'use client';

import { useState } from 'react';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import resourceDeleteAction from '@/features/resources/actions/delete-resource.action';
import { T_DTOResource } from '@/features/resources/types/t-dto-resource.type';

export function ProjectDeleteDialog({
  id,
  title,
}: Pick<T_DTOResource, 'id' | 'title'>) {
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    toast.loading('Deleting project...', { id: 'delete-project' });
    await resourceDeleteAction(id);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='w-fit' variant='destructive'>
          Delete Project
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-screen-sm'>
        <DialogHeader>
          <DialogTitle>Delete | {title}</DialogTitle>
        </DialogHeader>
        <Separator />
        <div className='w-full text-center'>
          <p className='text-lg font-bold text-destructive'>Warning</p>
          <p>
            This action cannot be undone! This will totally delete all data
            related to this resource! Do this only if you know what you are
            doing!
          </p>
        </div>
        <div className='flex w-full justify-end gap-2'>
          <Button onClick={handleDelete} variant='ghost'>
            Confirm Delete
          </Button>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
