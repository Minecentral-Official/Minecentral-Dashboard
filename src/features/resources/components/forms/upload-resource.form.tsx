'use client';

import { useState } from 'react';

import { generateUploadButton } from '@uploadthing/react';
import { toast } from 'sonner';

import { OurFileRouter } from '@/lib/uploadthing/uploadthing-filerouter';

export default function ResourceUploader({
  resourceId,
}: {
  resourceId: number;
}) {
  const [uploadResponse, setUploadResponse] = useState<{
    data: {
      url: string;
      type: string;
      name: string;
    };
  } | null>(null);

  const UploadButton = generateUploadButton<OurFileRouter>();

  return (
    <div className='rounded-lg border p-4'>
      <h2 className='text-lg font-bold'>Upload a Minecraft Resource</h2>
      <UploadButton
        input={{ resourceId }}
        endpoint='resourceUpload'
        onClientUploadComplete={(res) => {
          if (res) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setUploadResponse((res[0] as any).data);
          }
        }}
        onUploadError={(error) => {
          toast.error(`Upload failed: ${error.message}`);
        }}
        className='ut-button:bg-primary'
      />
      {uploadResponse && (
        <div className='mt-4 rounded bg-gray-100 p-2'>
          <p>
            <strong>Name:</strong> {uploadResponse.data.name}
          </p>
          <p>
            <strong>Type:</strong> {uploadResponse.data.type}
          </p>
          <p>
            <a
              href={uploadResponse.data.url}
              className='text-blue-500'
              target='_blank'
            >
              Download File
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
