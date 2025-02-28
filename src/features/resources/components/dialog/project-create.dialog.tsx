'use client';

import { useState } from 'react';

import { PlusCircleIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import ProjectCreateForm from '@/features/resources/components/forms/create-project.form';

export function ProjectCreateDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircleIcon className='mr-2 h-4 w-4' /> Create New Project
        </Button>
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
