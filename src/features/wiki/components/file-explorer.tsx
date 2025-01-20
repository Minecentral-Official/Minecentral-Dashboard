'use client';

import { useState } from 'react';

import { ChevronDown, ChevronRight, FileText, Folder } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

import type { GitHubContent } from '@/types/github';

interface FileExplorerProps {
  items: GitHubContent[];
  basePath?: string;
}

interface FolderItemProps {
  item: GitHubContent;
  basePath: string;
}

function FolderItem({ item, basePath }: FolderItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [children, setChildren] = useState<GitHubContent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFolderContents = async () => {
    if (children.length > 0) {
      setIsOpen(!isOpen);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/github/files?owner=minecental&repo=minecental&path=${item.path}`,
        {
          cache: 'no-store',
        },
      );

      if (!res.ok) {
        throw new Error('Failed to fetch folder contents');
      }

      const { data } = await res.json();
      setChildren(data);
      setIsOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='space-y-1'>
      <Button
        variant='ghost'
        className='h-auto w-full justify-start p-2 font-normal hover:bg-accent'
        onClick={fetchFolderContents}
      >
        <span className='inline-flex items-center'>
          {isOpen ?
            <ChevronDown className='mr-2 h-4 w-4' />
          : <ChevronRight className='mr-2 h-4 w-4' />}
          <Folder className='mr-2 h-4 w-4' />
          {item.name}
        </span>
      </Button>

      {isLoading && (
        <div className='pl-9 text-sm text-muted-foreground'>Loading...</div>
      )}

      {error && <div className='pl-9 text-sm text-red-500'>{error}</div>}

      {isOpen && children.length > 0 && (
        <div className='ml-3 border-l pl-6'>
          <FileExplorer items={children} basePath={basePath} />
        </div>
      )}
    </div>
  );
}

export function FileExplorer({ items, basePath = '/wiki' }: FileExplorerProps) {
  const sortedItems = [...items].sort((a, b) => {
    // Folders first, then files
    if (a.type !== b.type) {
      return a.type === 'dir' ? -1 : 1;
    }
    // Alphabetical order within same type
    return a.name.localeCompare(b.name);
  });

  return (
    <div className='space-y-1'>
      {sortedItems.map((item) => (
        <div key={item.path}>
          {item.type === 'dir' ?
            <FolderItem item={item} basePath={basePath} />
          : <Link href={`${basePath}/${encodeURIComponent(item.path)}`}>
              <Button
                variant='ghost'
                className='h-auto w-full justify-start p-2 font-normal hover:bg-accent'
              >
                <span className='inline-flex items-center'>
                  <FileText className='ml-6 mr-2 h-4 w-4' />
                  {item.name}
                </span>
              </Button>
            </Link>
          }
        </div>
      ))}
    </div>
  );
}
