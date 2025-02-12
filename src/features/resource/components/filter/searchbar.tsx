import { SearchIcon } from 'lucide-react';

import { Input } from '@/components/ui/input';

export default function ResourceSearchBar() {
  return (
    <div className='relative w-full'>
      <SearchIcon className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400' />
      <Input
        type='search'
        placeholder='Search for plugins, datapacks, or texture packs...'
        className='h-10 w-full pl-10'
      />
    </div>
  );
}
