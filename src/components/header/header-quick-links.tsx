import { ChevronDown, ListIcon, PlusIcon } from 'lucide-react';
import Link from 'next/link';

import ResponsiveDropdownMenuContent from '@/components/dropdown/responsive-dropdown-menu-content';
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function HeaderQuickLinks({
  CreateProject,
}: {
  CreateProject: React.ReactElement;
}) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className='flex flex-row gap-2'>
        <PlusIcon className='h-4 w-4' /> <ChevronDown className='h-4 w-4' />
      </DropdownMenuTrigger>
      <ResponsiveDropdownMenuContent>
        <DropdownMenuLabel className='p-0 font-normal'></DropdownMenuLabel>

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>{CreateProject}</DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href='/dashboard/resources/liked'
              className='hover:cursor-pointer'
            >
              <ListIcon />
              New Collection
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </ResponsiveDropdownMenuContent>
    </DropdownMenu>
  );
}
