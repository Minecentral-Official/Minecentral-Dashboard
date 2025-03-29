'use client';

import { ExternalLinkIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Card } from '@/components/ui/card';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import ButtonTooltip from '@/components/ui/tooltip-button';
import { T_DTOServer } from '@/features/serverlist/types/t-dto-server.type';
import { cn } from '@/lib/utils';

const navItems = [
  {
    title: 'General',
    url: '',
  },
  {
    title: 'Votifier',
    url: '/votifier',
  },
];

export default function ServerEditTopbarTabs({
  slug,
}: Pick<T_DTOServer, 'slug'>) {
  const urlPrefix = `/dashboard/servers/${slug}`;
  const pathname = usePathname();
  return (
    <Card className='flex flex-row items-center justify-between p-2'>
      <NavigationMenu className='justify-start'>
        <NavigationMenuList className=''>
          {navItems.map((item) => (
            <NavigationMenuItem key={item.title}>
              <Link href={`${urlPrefix}${item.url}`} legacyBehavior passHref>
                <NavigationMenuLink
                  active={pathname === `${urlPrefix}${item.url}`}
                  className={cn(navigationMenuTriggerStyle())}
                >
                  {item.title}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      <div>
        <Link href={`/serverlist/${slug}`}>
          <ButtonTooltip
            Icon={ExternalLinkIcon}
            tooltip='Go to Realm'
            variant={'ghost'}
          />
        </Link>
      </div>
    </Card>
  );
}
