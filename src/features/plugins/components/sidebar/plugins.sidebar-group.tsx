import { PlugIcon } from 'lucide-react';

import SidebarLinkWrapper from '@/components/sidebars/wrapper.sidebar-link';

export default function PluginsSidebar() {
  return (
    <SidebarLinkWrapper
      Icon={PlugIcon}
      name='Plugins'
      url='/dashboard/plugins'
    />
  );
}
