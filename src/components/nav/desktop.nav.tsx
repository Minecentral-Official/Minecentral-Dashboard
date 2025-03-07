
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

import { NavigationConfig } from '@/components/nav/nav-config.type';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { ComponentPropsWithoutRef, ElementRef, forwardRef, Fragment } from 'react';
import { cn } from '@/lib/utils';

export default function NavDesktop({ config }: { config: NavigationConfig }) {
  return (
    <NavigationMenu className='flex items-start justify-start'>
      <NavigationMenuList className='flex justify-start gap-2 text-nowrap'>
        {config.map((item) => (
          <Fragment key={item.title}>
            {item.items ? (<NavigationMenuItem key={item.title}><NavigationMenuTrigger className='flex flex-row gap-2'>

              <item.Icon className='w-4 h-4' />
              {item.title}

            </NavigationMenuTrigger>
              <NavigationMenuContent className='min-w-[250px]'>
                <ul className='p-4 flex flex-col gap-2'>
                  {item.items.map(({ title, href, ...rest }) => (
                    <li key={title} className='transition-colors hover:bg-accent focus:bg-accent p-2 rounded'>
                      <Link href={href} legacyBehavior passHref>
                        <NavigationMenuLink className='flex gap-2 items-center'>
                          <rest.Icon className='w-4 h-4 text-accent-foreground' />
                          <div className='text-sm font-medium leading-none'>
                            {title}
                          </div>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>)
              : (
                <NavigationMenuItem>
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), 'flex gap-2 items-center')}>
                      <item.Icon className='w-4 h-4 text-accent-foreground' />
                      <div className='text-sm font-medium leading-none'>
                        {item.title}
                      </div>
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )}
          </Fragment>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
