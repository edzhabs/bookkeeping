import {
  ArchiveIcon,
  BarChart3Icon,
  CarIcon,
  DollarSignIcon,
  FileSpreadsheetIcon,
  LayoutDashboardIcon,
  LucideFileText,
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
  ENROLLMENTS: { title: "Student Enrollment", url: "/enrollment" },
  ENROLL_NEW_STUDENT: { title: "Enroll New Student", url: "/enrollment/new" },
  ENROLL_OLD_STUDENT: {
    title: "Enroll Existing Student",
    url: "/enrollment/existing",
  },
  VIEW_STUDENT_DETAILS: { title: "Student Details", url: "/enrollment/:id" },
  EDIT_STUDENT_DETAILS: {
    title: "Edit Student Details",
    url: "/enrollment/:id/edit",
  },
  TUITION: { title: "Tuition", url: "/tuitions" },
  TUITION_DETAILS: { title: "View Tuition", url: "/tuitions/:id" },
  CARPOOL: { title: "Carpool", url: "/carpool" },
  OTHER_INCOME: { title: "Other Income", url: "/other_income" },
  TMPCCI_EXPENSES: { title: "TMPCCI - Expenses", url: "/school_expenses" },
  CARPOOL_EXPENSES: { title: "Carpool - Expenses", url: "/carpool_expenses" },
  FINANCIAL_REPORTS: { title: "Financial Reports", url: "/financial_reports" },
  TRANSACTIONS: { title: "Transactions", url: "/transactions" },
  TRANSACTIONS_DETAILS: { title: "Transactions", url: "/transactions/:id" },
  ARCHIVE: { title: "Archive", url: "/archive" },
  ARCHIVE_DETAILS: { title: "Archive", url: "/archive/:id" },
};

export const SIDEMENU = [
  {
    title: NAVTITLE.DASHBOARD.title,
    url: NAVTITLE.DASHBOARD.url,
    icon: LayoutDashboardIcon,
  },
  {
    title: NAVTITLE.ENROLLMENTS.title,
    url: NAVTITLE.ENROLLMENTS.url,
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
  {
    title: NAVTITLE.TRANSACTIONS.title,
    url: NAVTITLE.TRANSACTIONS.url,
    icon: LucideFileText,
  },
  {
    title: NAVTITLE.ARCHIVE.title,
    url: NAVTITLE.ARCHIVE.url,
    icon: ArchiveIcon,
  },
];

export default SIDEMENU;
