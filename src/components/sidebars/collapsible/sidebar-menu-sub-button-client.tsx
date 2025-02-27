'use client';

import { PropsWithChildren } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { SidebarMenuSubButton } from '@/components/ui/sidebar';

export default function SidebarMenuSubButtonClient({
  children,
  url,
}: PropsWithChildren & { url: string }) {
  const pathname = usePathname();
  return (
    <SidebarMenuSubButton asChild isActive={pathname.includes(url)}>
      <Link href={url}>{children}</Link>
    </SidebarMenuSubButton>
  );
}
