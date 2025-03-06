'use client';

import { BadgeCheck, EllipsisVertical, Settings2Icon } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type ManageServerDropdownProps = {
  serverId: number;
  serverUuid: string;
};

export default function ManageServerDropdown({
  serverId: id,
  serverUuid: uuid,
}: ManageServerDropdownProps) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button className='h-6 w-6 p-0' variant='ghost'>
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/hosting/servers/${id}`}>
              <Settings2Icon />
              Manage
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={`https://panel.ronanhost.com/server/${uuid}`}>
              <BadgeCheck />
              Go To Panel
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
