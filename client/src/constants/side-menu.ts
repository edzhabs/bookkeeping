import {
  BarChart3Icon,
  CarIcon,
  DollarSignIcon,
  FileSpreadsheetIcon,
  LayoutDashboardIcon,
  LucideIcon,
  PiggyBankIcon,
  ReceiptIcon,
  UsersIcon,
} from "lucide-react";

export interface ISideMenu {
  title: string;
  url: string;
  icon?: LucideIcon;
}

export const NAVTITLE = {
  DASHBOARD: {
    title: "Dashboard",
    url: "/dashboard",
  },
  STUDENTS: { title: "Students", url: "/students" },
  TUITION_PAYMENT: { title: "Tuition Payment", url: "/tuition/payment" },
  TUITION: { title: "Tuition", url: "/tuition" },
  CARPOOL: { title: "Carpool", url: "/carpool" },
  OTHER_INCOME: { title: "Other Income", url: "/other_income" },
  TMPCCI_EXPENSES: { title: "TMPCCI - Expenses", url: "/school_expenses" },
  CARPOOL_EXPENSES: { title: "Carpool - Expenses", url: "/carpool_expenses" },
  FINANCIAL_REPORTS: { title: "Financial Reports", url: "/financial_reports" },
};

export const SIDEMENU = [
  {
    title: NAVTITLE.DASHBOARD.title,
    url: NAVTITLE.DASHBOARD.url,
    icon: LayoutDashboardIcon,
  },
  {
    title: NAVTITLE.STUDENTS.title,
    url: NAVTITLE.STUDENTS.url,
    icon: UsersIcon,
  },
  {
    title: NAVTITLE.TUITION.title,
    url: NAVTITLE.TUITION.url,
    icon: DollarSignIcon,
  },
  {
    title: NAVTITLE.CARPOOL.title,
    url: NAVTITLE.CARPOOL.url,
    icon: CarIcon,
  },
  {
    title: NAVTITLE.OTHER_INCOME.title,
    url: NAVTITLE.OTHER_INCOME.url,
    icon: PiggyBankIcon,
  },
  {
    title: NAVTITLE.TMPCCI_EXPENSES.title,
    url: NAVTITLE.TMPCCI_EXPENSES.url,
    icon: ReceiptIcon,
  },
  {
    title: NAVTITLE.CARPOOL_EXPENSES.title,
    url: NAVTITLE.CARPOOL_EXPENSES.url,
    icon: FileSpreadsheetIcon,
  },
  {
    title: NAVTITLE.FINANCIAL_REPORTS.title,
    url: NAVTITLE.FINANCIAL_REPORTS.url,
    icon: BarChart3Icon,
  },
];

export default SIDEMENU;
