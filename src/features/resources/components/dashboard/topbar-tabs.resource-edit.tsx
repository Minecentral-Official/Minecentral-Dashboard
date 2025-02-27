'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { T_DTOResource } from '@/features/resources/types/t-dto-resource.type';
import { cn } from '@/lib/utils';

const navItems = [
  {
    title: 'General',
    url: '',
  },
  {
    title: 'Tags',
    url: '/tags',
  },
  {
    title: 'Versions',
    url: '/versions',
  },
  {
    title: 'Description',
    url: '/description',
  },
  {
    title: 'Links',
    url: '/links',
  },
];

export default function ResourceEditTopbarTabs({
  slug,
}: Pick<T_DTOResource, 'slug'>) {
  const urlPrefix = `/dashboard/resources/${slug}`;
  const pathname = usePathname();
  return (
    <NavigationMenu className='w-full justify-start rounded-md p-2 shadow-md'>
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
  );
}
