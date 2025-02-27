import React from 'react';

import { ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';

import CollapsibleClientWrapper from '@/components/sidebars/collapsible/collapsible-client.wrapper';
import SidebarMenuSubButtonClient from '@/components/sidebars/collapsible/sidebar-menu-sub-button-client';
import {
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';

type Params = {
  title: string;
  Icon: React.ElementType;
  urlSuffix: string;
  links: { name: string; url: string; icon: React.ElementType }[];
};

export default function CollapsibleSidebarWrapper(params: Params) {
  const { title, Icon, links, urlSuffix } = params;

  return (
    <SidebarMenu>
      <CollapsibleClientWrapper urlSuffix={urlSuffix}>
        <SidebarMenuItem>
          <SidebarMenuButton className='pl-0'>
            <SidebarMenuButton asChild>
              <Link href={`/dashboard/${urlSuffix}`}>
                <Icon />
                <span>{title}</span>
              </Link>
            </SidebarMenuButton>
            <CollapsibleTrigger asChild>
              <ChevronRightIcon className='ml-auto text-sm transition-transform duration-200 hover:text-secondary-foreground group-data-[state=open]/collapsible:rotate-90' />
            </CollapsibleTrigger>
          </SidebarMenuButton>
          <CollapsibleContent>
            <SidebarMenuSub>
              {links.map(({ name, url, ...rest }) => (
                <SidebarMenuSubItem key={name}>
                  <SidebarMenuSubButtonClient url={url}>
                    {rest.icon && <rest.icon />}
                    <span>{name}</span>
                  </SidebarMenuSubButtonClient>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </CollapsibleClientWrapper>
    </SidebarMenu>
  );
}
