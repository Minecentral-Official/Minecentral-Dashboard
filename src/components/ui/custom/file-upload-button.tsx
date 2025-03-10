'use client';

import { useRef } from 'react';

import { UploadIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

import type { ChangeEvent } from 'react';

interface FileUploadButtonProps {
  onFileSelect: (url: string, file: File) => void;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  accept?: string;
  className?: string;
}

export default function FileUploadButton({
  onFileSelect,
  variant = 'default',
  accept = 'image/*',
  className,
}: FileUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    // Create a URL for the file
    const url = URL.createObjectURL(file);

    onFileSelect(url, file);
  };

  return (
    <div className='flex flex-col gap-2'>
      <input
        type='file'
        className='hidden'
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
      />
      <Button
        type='button'
        onClick={handleButtonClick}
        variant={variant}
        className={className}
      >
        <UploadIcon className='mr-1 h-4 w-4' />
        Choose File
        {/* {fileName ? "Change File" : "Upload File"} */}
      </Button>

      {/* {fileName && <p className="text-sm text-muted-foreground mt-1">Selected: {fileName}</p>} */}
    </div>
  );
}
