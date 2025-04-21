import * as React from "react";

import { NavMain } from "@/components/Side/Nav/nav-main";
import { NavUser } from "@/components/Side/Nav/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import SIDEMENU from "@/constants/side-menu";
import logo from "@/assets/tmpcci-logo.png";

const data = {
  user: {
    firstName: "Jose",
    lastName: "Rizal",
    email: "testuser@mindpowercreativity.com",
    avatar: "/avatars/shadcn.jpg",
  },
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 h-14"
            >
              <a href="#">
                <img src={logo} alt="TMPCCI logo" className="h-10 w-10" />
                <span className="text-base font-semibold">
                  Talisay Mind Power <br />
                  Creativity Center, Inc.
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={SIDEMENU} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
