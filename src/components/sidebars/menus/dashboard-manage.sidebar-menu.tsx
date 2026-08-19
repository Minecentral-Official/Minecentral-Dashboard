import {
  EarthIcon,
  LayoutListIcon,
  ListIcon,
  StarIcon,
  ThumbsUpIcon,
} from 'lucide-react';

import CollapsibleSidebarWrapper from '@/components/sidebars/collapsible/collapsible-sidebar.wrapper';
import { SidebarGroup, SidebarMenu } from '@/components/ui/sidebar';

export default function SidebarDashboardManage() {
  return (
    <SidebarGroup>
      <SidebarMenu>
        <p className='text-md font-semibold'>Manage</p>
        <SidebarDashboardResouces />
        <SidebarDashboardServers />
      </SidebarMenu>
    </SidebarGroup>
  );
}

function SidebarDashboardResouces() {
  return (
    <CollapsibleSidebarWrapper
      urlSuffix='resources'
      title='Resources'
      Icon={LayoutListIcon}
      links={[
        {
          name: 'My Resources',
          url: '/dashboard/resources',
          icon: LayoutListIcon,
        },
        {
          name: 'Liked',
          url: '/dashboard/resources/liked',
          icon: ThumbsUpIcon,
        },
        {
          name: 'Collections',
          url: '/dashboard/resources/collections',
          icon: ListIcon,
        },
      ]}
    />
  );
}

function SidebarDashboardServers() {
  return (
    <CollapsibleSidebarWrapper
      urlSuffix='servers'
      title='Realms'
      Icon={EarthIcon}
      links={[
        {
          name: 'My Realms',
          url: '/dashboard/servers',
          icon: EarthIcon,
        },
        {
          name: 'Saved',
          url: '/dashboard/servers/saved',
          icon: StarIcon,
        },
        {
          name: 'My Votes',
          url: '/dashboard/servers/votes',
          icon: ListIcon,
        },
      ]}
    />
  );
}
