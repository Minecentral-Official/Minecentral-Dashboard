import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import { LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

import SignOutDropdownMenuItem from '@/auth/components/dropdowns/sign-out.dropdown-menu-item';
import getSession from '@/auth/lib/get-session';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default async function AuthNav() {
  const session = await getSession();

  if (!session) {
    return (
      <Button asChild>
        <Link href='/sign-in'>Sign In</Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className='cursor-pointer'>
          <AvatarImage src={session.user.image ?? undefined} />
          <AvatarFallback>
            {session.user.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>{session.user.name}</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href='/dashboard'>
              <LayoutDashboard />
              Dashboard
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <SignOutDropdownMenuItem />
      </DropdownMenuContent>
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
