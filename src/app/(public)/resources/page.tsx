'use client';

import { useState } from 'react';

import { FilterIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import PluginFilterSearchBar from '@/features/resource-plugin/components/filter-with-context/searchbar';
import FilterPluginSidebar from '@/features/resource-plugin/components/filter-with-context/sidebar';
import PluginCard from '@/features/resource-plugin/components/resource/plugin-card.view';
import PluginFilterBadges from '@/features/resource-plugin/components/ui/filter-badges';
import PluginLimitFilter from '@/features/resource-plugin/components/ui/limit-filter';
import PluginSortFilter from '@/features/resource-plugin/components/ui/sort-by-filter';
import {
  PluginFilterProvider,
  usePluginFilterContext,
} from '@/features/resource-plugin/context/plugin-filter.context';

export default function ResourceLandingPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <PluginFilterProvider>
      <div className='container mx-auto flex min-h-screen flex-col'>
        <div className='flex flex-1 overflow-hidden'>
          <FilterPluginSidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          <main className='flex w-full flex-col gap-2 overflow-y-auto pl-4 pt-4'>
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
            <div className='flex flex-row gap-2'>
              <PluginSortFilter />
              <PluginLimitFilter />
            </div>
            <div className='flex flex-wrap gap-2'>
              <PluginFilterBadges />
            </div>
            <div className='w-full'>
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
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3'>
          {plugins.map((plugin, index) => (
            <PluginCard key={index} {...plugin} />
          ))}
        </div>
      : <p className='mx-auto'>No resources found</p>}
    </>
  );
}
