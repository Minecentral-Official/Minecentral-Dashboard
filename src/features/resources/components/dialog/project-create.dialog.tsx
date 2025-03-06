'use client';

import { PropsWithChildren, useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import ProjectCreateForm from '@/features/resources/components/forms/create-project.form';

export function ProjectCreateDialog({
  children,
  className,
}: PropsWithChildren & { className: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className={className}>{children}</div>
      </DialogTrigger>
      <DialogContent className='max-w-screen-sm'>
        <DialogHeader>
          <DialogTitle>Create a new Project</DialogTitle>
        </DialogHeader>
        <Separator />
        <div className='mt-2 flex w-full flex-row gap-4'>
          <ProjectCreateForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}
