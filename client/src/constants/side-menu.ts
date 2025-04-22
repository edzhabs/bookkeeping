import { LayoutDashboardIcon, UsersIcon, ListIcon } from "lucide-react";

export const DASHBOARD = "Dashboard";
export const STUDENTS = "Students";

export const SIDEMENU = [
  {
    title: DASHBOARD,
    url: "/dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    title: STUDENTS,
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
