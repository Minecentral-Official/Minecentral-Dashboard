import { XIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface FilterSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function ResourceFilterSidebar({
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
        <div>
          <h2 className='mb-2 text-lg font-semibold'>Resource Type</h2>
          <div className='space-y-2'>
            <div className='flex items-center'>
              <Checkbox id='plugins' />
              <Label htmlFor='plugins' className='ml-2'>
                Plugins
              </Label>
            </div>
            <div className='flex items-center'>
              <Checkbox id='datapacks' />
              <Label htmlFor='datapacks' className='ml-2'>
                Datapacks
              </Label>
            </div>
            <div className='flex items-center'>
              <Checkbox id='texturepacks' />
              <Label htmlFor='texturepacks' className='ml-2'>
                Texture Packs
              </Label>
            </div>
          </div>
        </div>
        <div>
          <h2 className='mb-2 text-lg font-semibold'>Category</h2>
          <div className='space-y-2'>
            <div className='flex items-center'>
              <Checkbox id='survival' />
              <Label htmlFor='survival' className='ml-2'>
                Survival
              </Label>
            </div>
            <div className='flex items-center'>
              <Checkbox id='building' />
              <Label htmlFor='building' className='ml-2'>
                Building
              </Label>
            </div>
            <div className='flex items-center'>
              <Checkbox id='adventure' />
              <Label htmlFor='adventure' className='ml-2'>
                Adventure
              </Label>
            </div>
            {/* Add more categories as needed */}
          </div>
        </div>
        {/* Add more filter sections (e.g., Minecraft Version, etc.) as needed */}
      </div>
    </aside>
  );
}
