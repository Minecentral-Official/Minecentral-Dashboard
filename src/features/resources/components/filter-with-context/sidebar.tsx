import { XIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import PluginCategoriesFilter from '@/features/resources/components/filter-with-context/categories-filter';
import PluginVersionsFilter from '@/features/resources/components/filter-with-context/versions-filter';

interface FilterSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function FilterPluginSidebar({
  open,
  onClose,
}: FilterSidebarProps) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r bg-background transition-transform duration-200 ease-in-out md:z-10 ${open ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}
    >
      <div className='flex items-center justify-between p-4 md:hidden'>
        <h2 className='text-lg font-semibold'>Resource Filters</h2>
        <Button variant='ghost' size='icon' onClick={onClose}>
          <XIcon className='h-4 w-4' />
          <span className='sr-only'>Close sidebar</span>
        </Button>
      </div>
      <div className='space-y-6 p-4'>
        <PluginCategoriesFilter />
        <PluginVersionsFilter />
      </div>
    </aside>
  );
}
