import { PropsWithChildren } from 'react';

import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import {
  BadgeCheck,
  ChartBarBig,
  LayoutListIcon,
  ListIcon,
  ThumbsUpIcon,
} from 'lucide-react';
import Link from 'next/link';

import ResponsiveDropdownMenuContent from '@/components/dropdown/responsive-dropdown-menu-content';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import SignOutDropdownMenuItem from '@/lib/auth/components/dropdowns/sign-out.dropdown-menu-item';
import getSession from '@/lib/auth/helpers/get-session';

export default async function AuthNav({
  children,
  className,
}: PropsWithChildren & { className?: string }) {
  const session = await getSession();

  if (!session) {
    return (
      <Button asChild>
        <Link href='/sign-in'>Sign In</Link>
      </Button>
    );
  }

  const userInitials = session.user.name.charAt(0).toUpperCase();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        {/* Keep the div here otherwise avatar will not load here */}
        <div className={className}>{children}</div>
      </DropdownMenuTrigger>
      <ResponsiveDropdownMenuContent>
        <DropdownMenuLabel className='p-0 font-normal'>
          <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
            <Avatar className='h-8 w-8 rounded-lg'>
              <AvatarImage
                src={session.user.image ?? undefined}
                alt={session.user.name}
              />
              <AvatarFallback className='rounded-lg'>
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className='grid flex-1 text-left text-sm leading-tight'>
              <span className='truncate font-semibold'>
                {session.user.name}
              </span>
              <span className='truncate text-xs'>{session.user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href='/dashboard' className='hover:cursor-pointer'>
              <ChartBarBig />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href='/dashboard/account' className='hover:cursor-pointer'>
              <BadgeCheck />
              Account
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href='/dashboard/resources' className='hover:cursor-pointer'>
              <LayoutListIcon />
              My Resources
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href='/dashboard/resources/liked'
              className='hover:cursor-pointer'
            >
              <ThumbsUpIcon />
              My Likes
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href='/dashboard/resources/collections'
              className='hover:cursor-pointer'
            >
              <ListIcon />
              My Collections
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <SignOutDropdownMenuItem />
      </ResponsiveDropdownMenuContent>
    </DropdownMenu>
  );
}
