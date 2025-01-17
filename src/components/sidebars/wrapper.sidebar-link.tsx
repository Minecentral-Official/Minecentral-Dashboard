import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';

type SidebarGroupWrapperProps = {
  name: string;
  url: string;
  Icon: React.ElementType;
};

export default function SidebarLinkWrapper({
  name,
  Icon,
  url,
}: SidebarGroupWrapperProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <a href={url}>
          <Icon />
          <span>{name}</span>
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
