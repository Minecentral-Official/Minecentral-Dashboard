import { PropsWithChildren } from 'react';

import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import { BadgeCheck, ChartBarBig, LayoutListIcon } from 'lucide-react';
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

export default async function AuthNav({ children }: PropsWithChildren) {
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* Keep the div here otherwise avatar will not load here */}
        <div>{children}</div>
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
            <Link href='/dashboard'>
              <ChartBarBig />
              Dashboard
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href='/dashboard/account'>
              <BadgeCheck />
              Account
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href='/dashboard/resources'>
              <LayoutListIcon />
              Resources
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <SignOutDropdownMenuItem />
      </ResponsiveDropdownMenuContent>
    </DropdownMenu>
  );
}

// export default function DropdownDemo() {
//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="outline">
//           Labeled grouped items
//           <ChevronDown
//             className="-me-1 ms-2 opacity-60"
//             size={16}
//             strokeWidth={2}
//             aria-hidden="true"
//           />
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent>
//         <DropdownMenuLabel>Label</DropdownMenuLabel>
//         <DropdownMenuGroup>
//           <DropdownMenuItem>
//             <CopyPlus size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
//             Copy
//           </DropdownMenuItem>
//           <DropdownMenuItem>
//             <Bolt size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
//             Edit
//           </DropdownMenuItem>
//         </DropdownMenuGroup>
//         <DropdownMenuSeparator />
//         <DropdownMenuLabel>Label</DropdownMenuLabel>
//         <DropdownMenuGroup>
//           <DropdownMenuItem>
//             <Layers2 size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
//             Group
//           </DropdownMenuItem>
//           <DropdownMenuItem>
//             <Files size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
//             Clone
//           </DropdownMenuItem>
//           <DropdownMenuItem className="text-destructive focus:text-destructive">
//             <Trash size={16} strokeWidth={2} aria-hidden="true" />
//             Delete
//           </DropdownMenuItem>
//         </DropdownMenuGroup>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }
