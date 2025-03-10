'use client';

import { Fragment } from 'react';

import { usePathname } from 'next/navigation';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';

export default function DataBreadcrumbs() {
  const paths = usePathname();

  const pathNames = paths.split('/').filter((path) => path);
  const pathItems = pathNames.map((path, i) => ({
    // Optionally you can capitalize the first letter here
    name: path.charAt(0).toUpperCase() + path.slice(1),
    path: '/' + pathNames.slice(0, i + 1).join('/'),
  }));

  const pathLinkItems = pathItems.slice(0, -1);
  const currentPath = pathItems[pathItems.length - 1];

  if (pathLinkItems.length < 1) return <></>;

  return (
    <>
      <Separator orientation='vertical' className='mr-2 h-4 md:hidden' />
      <Breadcrumb>
        <BreadcrumbList>
          {pathLinkItems.map(({ name, path }) => (
            <Fragment key={name}>
              <BreadcrumbItem>
                <BreadcrumbLink href={path}>{name}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </Fragment>
          ))}

          <BreadcrumbItem>
            <BreadcrumbPage>{currentPath.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
}
