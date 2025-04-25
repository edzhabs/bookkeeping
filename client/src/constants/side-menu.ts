import {
  BarChart3Icon,
  CarIcon,
  DollarSignIcon,
  FileSpreadsheetIcon,
  LayoutDashboardIcon,
  PiggyBankIcon,
  ReceiptIcon,
  UsersIcon,
} from "lucide-react";

export const DASHBOARD = "Dashboard";
export const STUDENTS = "Students";
export const TUITION = "Tuition";
export const CARPOOL = "Carpool";
export const OTHER_INCOME = "Other Income";
export const TMPCCI_EXPENSES = "TMPCCI - Expenses";
export const CARPOOL_EXPENSES = "Carpool - Expenses";
export const FINANCIAL_REPORTS = "Financial Reports";

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
    title: TUITION,
    url: "/tuition",
    icon: DollarSignIcon,
  },
  {
    title: CARPOOL,
    url: "/carpool",
    icon: CarIcon,
  },
  {
    title: OTHER_INCOME,
    url: "/other_income",
    icon: PiggyBankIcon,
  },
  {
    title: TMPCCI_EXPENSES,
    url: "/tmpcci_expenses",
    icon: ReceiptIcon,
  },
  {
    title: CARPOOL_EXPENSES,
    url: "/carpool_expenses",
    icon: FileSpreadsheetIcon,
  },
  {
    title: FINANCIAL_REPORTS,
    url: "/financial_reports",
    icon: BarChart3Icon,
  },
];

export default SIDEMENU;
