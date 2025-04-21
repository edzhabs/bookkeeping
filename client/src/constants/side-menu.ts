import { LayoutDashboardIcon, UsersIcon, ListIcon } from "lucide-react";

export const SIDEMENU = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Students",
    url: "/students",
    icon: UsersIcon,
  },
  {
    title: "Payments",
    url: "#",
    icon: ListIcon,
  },
];

export default SIDEMENU;
