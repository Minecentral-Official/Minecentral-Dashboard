import { PropsWithChildren } from 'react';

import SidebarWrapper from '@/components/sidebars/sidebar.wrapper';
import PluginCategoriesFilter from '@/features/resources/components/filter/categories-filter';
import PluginVersionsFilter from '@/features/resources/components/filter/versions-filter';
import { PluginFilterProvider } from '@/features/resources/context/plugin-filter.context';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <PluginFilterProvider>
      <SidebarWrapper
        sidebar={
          <div className='flex h-full flex-col justify-between'>
            <PluginCategoriesFilter />
            <PluginVersionsFilter />
          </div>
        }
      >
        <div className='h-full w-full p-6'>{children}</div>
      </SidebarWrapper>
    </PluginFilterProvider>
  );
}
