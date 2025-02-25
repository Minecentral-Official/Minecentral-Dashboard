import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from '@/components/ui/sidebar';

import type { PropsWithChildren } from 'react';

type SidebarGroupWrapperProps = PropsWithChildren<{ title: string }>;

export default function SidebarGroupWrapper({
  children,
  title,
}: SidebarGroupWrapperProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu className='ml-2'>{children}</SidebarMenu>
    </SidebarGroup>
  );
}
