import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { ISideMenu } from "@/constants/side-menu";
import SideBarItem from "./nav-item";

export function NavMain({ items }: { items: ISideMenu[] }) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu className="px-5 gap-y-2">
          {items.map((item) => (
            <SideBarItem item={item} key={item.url} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
