import { NotebookIcon } from 'lucide-react';

import SidebarLink from '@/components/sidebars/link.sidebar';
import { SidebarGroup, SidebarMenu } from '@/components/ui/sidebar';
import getSession from '@/lib/auth/helpers/get-session';
import { hasPermission } from '@/lib/auth/helpers/permissions';

export async function SidebarAdminResources() {
  const session = await getSession();
  const curate = hasPermission(session?.user.role, 'catalog:curate');
  return (
    <SidebarGroup className='py-1'>
      <SidebarMenu>
        {curate && (
          <>
            <SidebarLink
              Icon={NotebookIcon}
              name='Catalog curation'
              url='/admin/catalog'
            />
            <SidebarLink
              Icon={NotebookIcon}
              name='Source syncs'
              url='/admin/sources'
            />
          </>
        )}
        <SidebarLink
          Icon={NotebookIcon}
          name='All Projects'
          url='/admin/resources'
        />
      </SidebarMenu>
    </SidebarGroup>
  );
}
