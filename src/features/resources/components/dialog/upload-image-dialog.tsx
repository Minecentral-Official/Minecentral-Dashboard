'use client';

import { useState } from 'react';

import Image from 'next/image';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import ResourceUploadIconForm from '@/features/resources/components/forms/upload-resource-image.form';
import { TResourcePlugin } from '@/features/resources/types/t-dto-resource-with-releases.type';

// const formSchema = z.object({
//   image: z
//     .instanceof(File)
//     .refine((file) => file.size <= 5000000, `Max file size is 5MB.`)
//     .refine(
//       (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
//       'Only .jpg, .png, and .webp formats are supported.',
//     ),
// });

export function ResourceUploadImageDialog({
  title,
  iconUrl,
  id,
}: Pick<TResourcePlugin, 'title' | 'iconUrl' | 'id'>) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <p className='hover:cursor-pointer hover:underline'>
          Edit Resource Icon
        </p>
      </DialogTrigger>
      <DialogContent className='max-w-screen-sm md:max-w-screen-md'>
        <DialogHeader>
          <DialogTitle>{title} | Edit Resource Icon</DialogTitle>
        </DialogHeader>
        <div className='flex flex-row gap-4'>
          <Image
            src={iconUrl || '/placeholder.png'}
            alt={title}
            width={300}
            height={200}
            className='h-32 w-32 object-cover'
          />
          <ResourceUploadIconForm resourceId={id} setOpen={setOpen} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
