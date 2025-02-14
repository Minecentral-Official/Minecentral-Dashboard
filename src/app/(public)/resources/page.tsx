'use client';

import { useState } from 'react';

import { FilterIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import FilterPluginSearchBar from '@/features/resource/components/with-context/searchbar';
import FilterPluginSidebar from '@/features/resource/components/with-context/sidebar';
import { FilterPluginProvider } from '@/features/resource/context/plugin.filter';

export default function ResourceLandingPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // const resources = []

  return (
    <FilterPluginProvider>
      <div className='flex min-h-screen flex-col pt-20'>
        <div className='flex flex-1 overflow-hidden'>
          <FilterPluginSidebar
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
              <FilterPluginSearchBar />
            </div>
            <div className='mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-6 md:gap-6 lg:grid-cols-3'></div>
          </main>
        </div>
      </div>
    </FilterPluginProvider>
  );
}
