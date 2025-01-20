'use client';

import { useEffect, useState } from 'react';

import { FileIcon, FolderIcon } from 'lucide-react';

import { clientEnv } from '@/lib/env/client.env';

interface FileItem {
  name: string;
  path: string;
  type: 'file' | 'dir';
}

export default function FileExplorer({
  onFileSelect,
}: {
  onFileSelect: (path: string) => void;
}) {
  const [currentPath, setCurrentPath] = useState('');
  const [contents, setContents] = useState<FileItem[]>([]);

  useEffect(() => {
    fetchContents(currentPath);
  }, [currentPath]);

  async function fetchContents(path: string) {
    const response = await fetch(
      `${clientEnv.NEXT_PUBLIC_FRONTEND_URL}/api/wiki-content?path=${encodeURIComponent(path)}`,
    );
    if (response.ok) {
      const data = await response.json();
      setContents(data.contents || []);
    }
  }

  function handleItemClick(item: FileItem) {
    if (item.type === 'dir') {
      setCurrentPath(item.path);
    } else {
      onFileSelect(item.path);
    }
  }

  return (
    <div className='rounded-lg bg-gray-100 p-4'>
      <h2 className='mb-2 text-xl font-semibold'>File Explorer</h2>
      {currentPath !== '' && (
        <button
          onClick={() =>
            setCurrentPath(currentPath.split('/').slice(0, -1).join('/'))
          }
          className='mb-2 text-blue-500 hover:underline'
        >
          ../ (Up one level)
        </button>
      )}
      <ul>
        {contents.map((item) => (
          <li key={item.path} className='mb-1'>
            <button
              onClick={() => handleItemClick(item)}
              className='flex w-full items-center rounded p-1 text-left hover:bg-gray-200'
            >
              {item.type === 'dir' ?
                <FolderIcon className='mr-2' size={16} />
              : <FileIcon className='mr-2' size={16} />}
              {item.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
