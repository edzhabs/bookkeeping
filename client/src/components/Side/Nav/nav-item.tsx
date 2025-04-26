import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { ISideMenu } from "@/constants/side-menu";
import { NavLink, useMatch } from "react-router-dom";

const SideBarItem = ({ item }: { item: ISideMenu }) => {
  const match = useMatch({ path: item.url.toLowerCase() + "/*", end: false });
  const isActive = Boolean(match);
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild tooltip={item.title} isActive={isActive}>
        <NavLink to={item.url}>
          {item.icon && <item.icon />}
          <span>{item.title}</span>
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default SideBarItem;
