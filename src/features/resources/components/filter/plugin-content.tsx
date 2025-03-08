'use client';

import PluginLimitFilter from '@/features/resources/components/filter/limit-filter';
import { ResourceFilterPage } from '@/features/resources/components/filter/resource-pagination';
import PluginFilterSearchBar from '@/features/resources/components/filter/searchbar';
import PluginSortFilter from '@/features/resources/components/filter/sort-by-filter';
import PluginCardView from '@/features/resources/components/resource/cards/plugin-view.card';
import PluginFilterBadges from '@/features/resources/components/ui/filter-badges';
import { usePluginFilterContext } from '@/features/resources/context/plugin-filter.context';

export default function PluginContent() {
  const { plugins } = usePluginFilterContext();
  return (
    <main className='flex w-full flex-col gap-2 overflow-y-auto pt-4'>
      <div className='flex w-full flex-row gap-2'>
        <PluginFilterSearchBar />
      </div>
      <div className='flex flex-row gap-2'>
        <PluginSortFilter />
        <PluginLimitFilter />
      </div>
      <div className='flex flex-wrap gap-2'>
        <PluginFilterBadges />
      </div>
      <div className='flex w-full flex-col gap-2'>
        <ResourceFilterPage />
        {plugins ?
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3'>
            {plugins.map((plugin, index) => (
              <PluginCardView key={index} {...plugin} />
            ))}
          </div>
        : <p className='mx-auto'>No resources found</p>}
        <ResourceFilterPage />
      </div>
    </main>
  );
}
