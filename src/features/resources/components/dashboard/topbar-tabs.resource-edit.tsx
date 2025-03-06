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
      <Link href={`/plugins/${slug}`}>
        <ExternalLinkIcon className='mr-2 h-5 w-5' />
      </Link>
    </Card>
  );
}
