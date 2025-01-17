import { Server } from 'lucide-react';

import SidebarLinkWrapper from '@/components/sidebars/wrapper.sidebar-link';

export default function HostSidebar() {
  return (
    <SidebarLinkWrapper Icon={Server} name='Hosting' url='/dashboard/host' />
  );
}
