'use client';

import { PropsWithChildren } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { SidebarMenuSubButton } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

export default function SidebarMenuSubButtonClient({
  children,
  url,
}: PropsWithChildren & { url: string }) {
  const pathname = usePathname();
  return (
    <SidebarMenuSubButton
      asChild
      isActive={pathname.includes(url)}
      className={cn(
        'h-9 rounded-md px-3 text-muted-foreground transition-colors',
        'hover:bg-muted hover:text-foreground',
        'data-[active=true]:bg-primary data-[active=true]:font-medium data-[active=true]:text-primary-foreground',
        '[&>svg]:text-muted-foreground data-[active=true]:[&>svg]:text-primary-foreground',
      )}
    >
      <Link href={url}>{children}</Link>
    </SidebarMenuSubButton>
  );
}
