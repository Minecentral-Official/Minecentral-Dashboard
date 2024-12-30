import { MoveRight } from 'lucide-react';

import { navigationItems } from '@/components/services/host/nav.config';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

export default function NavDesktop() {
  return (
    <NavigationMenu className='flex items-start justify-start'>
      <NavigationMenuList className='flex flex-row justify-start gap-4'>
        {navigationItems.map((item) => (
          <NavigationMenuItem key={item.title}>
            {item.href ?
              <>
                <NavigationMenuLink href={item.href}>
                  <Button variant='ghost'>{item.title}</Button>
                </NavigationMenuLink>
              </>
            : <>
                <NavigationMenuTrigger className='text-sm font-medium'>
                  {item.title}
                </NavigationMenuTrigger>
                <NavigationMenuContent className='!w-[450px] p-4'>
                  <div className='flex grid-cols-2 flex-col gap-4 lg:grid'>
                    <div className='flex h-full flex-col justify-between'>
                      <div className='flex flex-col'>
                        <p className='text-base'>{item.title}</p>
                        <p className='text-sm text-muted-foreground'>
                          {item.description}
                        </p>
                      </div>
                      <Button size='sm' className='mt-10'>
                        Book a call today
                      </Button>
                    </div>
                    <div className='flex h-full flex-col justify-end text-sm'>
                      {item.items?.map(({ href, title }) => (
                        <NavigationMenuLink
                          href={href}
                          key={title}
                          className='flex flex-row items-center justify-between rounded px-4 py-2 hover:bg-muted'
                        >
                          <span>{title}</span>
                          <MoveRight className='h-4 w-4 text-muted-foreground' />
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </div>
                </NavigationMenuContent>
              </>
            }
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
