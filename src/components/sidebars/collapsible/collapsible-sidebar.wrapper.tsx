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
    <SidebarMenu className='gap-1'>
      <CollapsibleClientWrapper urlSuffix={urlSuffix}>
        <SidebarMenuItem>
          <div className='flex h-10 items-center rounded-md px-3 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground group-data-[state=open]/collapsible:bg-muted group-data-[state=open]/collapsible:text-foreground'>
            <Link
              href={`/dashboard/${urlSuffix}`}
              className='flex min-w-0 flex-1 items-center gap-2 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring'
            >
              <Icon className='h-4 w-4 shrink-0 text-muted-foreground' />
              <span className='truncate'>{title}</span>
            </Link>
            <CollapsibleTrigger asChild>
              <button
                type='button'
                className='ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground'
                aria-label={`Toggle ${title}`}
              >
                <ChevronRightIcon className='h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
              </button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <SidebarMenuSub className='mx-4 mt-1 gap-1 border-l px-2 py-1'>
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
