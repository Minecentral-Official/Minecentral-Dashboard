'use client';

import { Dispatch, SetStateAction } from 'react';

import { generateUploadButton } from '@uploadthing/react';
import { toast } from 'sonner';

import { OurFileRouter } from '@/lib/uploadthing/uploadthing-filerouter';

export default function ResourceUploadIconForm({
  resourceId,
  setOpen,
}: {
  resourceId: number;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const UploadButton = generateUploadButton<OurFileRouter>();

  return (
    <div className='flex w-full flex-col justify-between'>
      <p>Upload a new resource icon, allowed files are</p>
      <UploadButton
        endpoint={'iconUploader'}
        input={{ resourceId }}
        className='ut-button:w-full ut-button:bg-primary ut-button:text-base'
        appearance={{ allowedContent: { display: 'none' } }}
        onClientUploadComplete={() => {
          setOpen(false);
          toast.success('Resource Icon Uploaded!', { id: 'resource_icon' });
        }}
        onUploadError={(error) => {
          toast.error(`Upload failed: ${error.message}`, {
            id: 'resource_icon',
          });
        }}
      />
    </div>
  );
}
