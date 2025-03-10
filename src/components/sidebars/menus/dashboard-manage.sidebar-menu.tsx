import {
  LayoutListIcon,
  ListIcon,
  ServerIcon,
  ThumbsUpIcon,
} from 'lucide-react';

import CollapsibleSidebarWrapper from '@/components/sidebars/collapsible/collapsible-sidebar.wrapper';
import SidebarLink from '@/components/sidebars/link.sidebar';
import { SidebarGroup, SidebarMenu } from '@/components/ui/sidebar';

export default function SidebarDashboardManage() {
  return (
    <SidebarGroup>
      <SidebarMenu>
        <p className='text-md font-semibold'>Manage</p>
        <SidebarDashboardResouces />
        <SidebarLink
          Icon={ServerIcon}
          name='My Servers'
          url='/dashboard/hosting'
        />
      </SidebarMenu>
    </SidebarGroup>
  );
}

function SidebarDashboardResouces() {
  return (
    <CollapsibleSidebarWrapper
      urlSuffix='resources'
      title='Resouces'
      Icon={LayoutListIcon}
      links={[
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
