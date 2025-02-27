import SidebarMenuSubButtonClient from '@/components/sidebars/collapsible/sidebar-menu-sub-button-client';
import { SidebarMenuItem } from '@/components/ui/sidebar';

type SidebarGroupWrapperProps = {
  name: string;
  url: string;
  Icon?: React.ElementType;
};

export default function SidebarLink({
  name,
  Icon,
  url,
}: SidebarGroupWrapperProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuSubButtonClient url={url}>
        {Icon ?
          <Icon />
        : <></>}
        <span>{name}</span>
      </SidebarMenuSubButtonClient>
    </SidebarMenuItem>
  );
}
