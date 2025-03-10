import { Metadata } from 'next';

import SidebarWrapper from '@/components/sidebars/sidebar.wrapper';
import { Separator } from '@/components/ui/separator';
import FilterCategories from '@/features/resources/components/filter/filter-categories';
import FilterVersions from '@/features/resources/components/filter/filter-versions';
import PluginLimitFilter from '@/features/resources/components/filter/limit-filter';
import ResourceList from '@/features/resources/components/filter/resource-list';
import { ResourceFilterPage } from '@/features/resources/components/filter/resource-pagination';
import PluginFilterSearchBar from '@/features/resources/components/filter/searchbar';
import PluginSortFilter from '@/features/resources/components/filter/sort-by-filter';
import PluginFilterBadges from '@/features/resources/components/ui/filter-badges';
import { PluginFilterProvider } from '@/features/resources/context/plugin-filter.context';

export const metadata: Metadata = {
  title: 'Plugins',
};

export default function PluginContent() {
  return (
    <PluginFilterProvider>
      <SidebarWrapper
        sidebar={
          <div className='flex h-full flex-col justify-start gap-4 pt-2'>
            <FilterCategories />
            <Separator />
            <FilterVersions />
            <Separator />
          </div>
        }
      >
        <main className='flex h-full w-full flex-col gap-2 overflow-y-auto'>
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
            <ResourceList />
            <ResourceFilterPage />
          </div>
        </main>
      </SidebarWrapper>
    </PluginFilterProvider>
  );
}
