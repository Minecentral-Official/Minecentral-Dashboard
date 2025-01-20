'use client';

import { useState } from 'react';

import FileExplorer from '@/features/wiki/components/file-explorer';
import WikiContent from '@/features/wiki/components/wiki-content';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState('home.md');

  return (
    <main className='container mx-auto p-4'>
      <h1 className='mb-4 text-3xl font-bold'>Wiki Content</h1>
      <div className='flex gap-4'>
        <div className='w-1/4'>
          <FileExplorer onFileSelect={setSelectedFile} />
        </div>
        <div className='w-3/4'>
          <WikiContent path={selectedFile} />
        </div>
      </div>
    </main>
  );
}
