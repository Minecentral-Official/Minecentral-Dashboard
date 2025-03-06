import {
  DropdownMenuContent,
  DropdownMenuItem,
} from '@radix-ui/react-dropdown-menu';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

import { NavigationConfig } from '@/components/nav/nav-config.type';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';

export default function NavDesktop({ config }: { config: NavigationConfig }) {
  return (
    <NavigationMenu className='flex items-start justify-start'>
      <NavigationMenuList className='flex flex-row justify-start gap-2 text-nowrap'>
        {config.map((item) => (
          <NavigationMenuItem key={item.title}>
            {item.href ?
              <>
                <NavigationMenuLink href={item.href}>
                  <Button variant='ghost' className='flex flex-row gap-1'>
                    {item.Icon && <item.Icon className='h-4 w-4' />}
                    {item.title}
                  </Button>
                </NavigationMenuLink>
              </>
            : <DropdownMenu modal={false}>
                <DropdownMenuTrigger className='flex flex-row items-center gap-1 rounded-md p-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground'>
                  {item.Icon && <item.Icon className='h-4 w-4' />}
                  {item.title}
                  <ChevronDown className='h-4 w-4' />
                </DropdownMenuTrigger>
                <DropdownMenuContent className='flex flex-col gap-1 rounded-md bg-secondary p-2'>
                  {item.items?.map(({ href, title, Icon }) => (
                    <DropdownMenuItem
                      key={title}
                      className={
                        'w-full text-nowrap rounded-md p-1 px-2 text-sm hover:cursor-pointer hover:bg-accent'
                      }
                      asChild
                    >
                      <Link
                        href={href}
                        className='flex flex-row items-center gap-1'
                      >
                        {Icon && <Icon className='h-4 w-4' />}
                        {title}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            }
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
