'use client';

import { useState } from 'react';

import { FilterIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import ResourceCard from '@/features/resource/components/card/resource.card';
import ResourceSearchBar from '@/features/resource/components/filter/searchbar';
import ResourceFilterSidebar from '@/features/resource/components/filter/sidebar';

const resources = [
  {
    title: 'Medieval Texture Pack',
    type: 'Texture Pack',
    author: 'PixelArtist',
    downloads: 5000,
  },
  {
    title: 'Epic Survival Plugin',
    type: 'Plugin',
    author: 'MinecraftMaster',
    downloads: 1000,
  },
  {
    title: 'Advanced Farming Datapack',
    type: 'Datapack',
    author: 'RedstoneWizard',
    downloads: 3000,
  },
];

export default function ResourceLandingPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className='flex min-h-screen flex-col pt-20'>
      <div className='flex flex-1 overflow-hidden'>
        <ResourceFilterSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className='w-full flex-1 overflow-y-auto p-4 md:p-6'>
          <div className='flex w-full flex-row gap-2'>
            <div className='bg-background md:hidden'>
              <Button
                variant='outline'
                size='icon'
                className='h-10'
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <FilterIcon className='h-4 w-4' />
                <span className='sr-only'>Toggle sidebar</span>
              </Button>
            </div>
            <ResourceSearchBar />
          </div>
          <div className='mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-6 md:gap-6 lg:grid-cols-3'>
            {resources.map(({ title, downloads, author, type }, index) => (
              <ResourceCard
                key={index}
                title={title}
                author={author}
                downloads={downloads}
                type={type}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
