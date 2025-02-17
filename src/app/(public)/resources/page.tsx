'use client';

import { useState } from 'react';

import { FilterIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import PluginFilterSearchBar from '@/features/resource-plugin/components/filter-with-context/searchbar';
import FilterPluginSidebar from '@/features/resource-plugin/components/filter-with-context/sidebar';
import ResourceCardView from '@/features/resource-plugin/components/views/plugin-card.view';
import {
  PluginFilterProvider,
  usePluginFilterContext,
} from '@/features/resource-plugin/context/plugin-filter.context';
import { PluginProvider } from '@/features/resource-plugin/context/plugin.context';

export default function ResourceLandingPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <PluginFilterProvider>
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
              <PluginFilterSearchBar />
            </div>
            <div className='mt-4 w-full'>
              <ResourceList />
            </div>
          </main>
        </div>
      </div>
    </PluginFilterProvider>
  );
}

function ResourceList() {
  const { plugins } = usePluginFilterContext();
  return (
    <>
      {plugins ?
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-6 md:gap-6 lg:grid-cols-3'>
          {plugins.map((plugin, index) => (
            <PluginProvider key={index} {...plugin}>
              <ResourceCardView />
            </PluginProvider>
          ))}
        </div>
      : <p className='mx-auto'>No resources found</p>}
    </>
  );
}
