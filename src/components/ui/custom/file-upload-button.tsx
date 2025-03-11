'use client';

import { useRef } from 'react';

import { PencilLineIcon, UploadIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
  selected?: boolean;
}

export default function FileUploadButton({
  onFileSelect,
  variant = 'default',
  accept = 'image/*',
  className,
  selected = false,
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
        className={cn(selected ? 'bg-primary/70' : '', className)}
      >
        {selected ?
          <PencilLineIcon className='mr-1 h-4 w-4' />
        : <UploadIcon className='mr-1 h-4 w-4' />}
        {selected ? 'Change File' : 'Choose File'}
      </Button>
    </div>
  );
}
