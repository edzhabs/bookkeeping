import {
  CARPOOL,
  CARPOOL_EXPENSES,
  DASHBOARD,
  FINANCIAL_REPORTS,
  OTHER_INCOME,
  STUDENTS,
  TMPCCI_EXPENSES,
  TUITION,
} from "@/constants/side-menu";
import DashboardPage from "@/pages/DashboardPage";
import CarpoolExpensePage from "@/pages/CarpoolExpensePage";
import CarpoolPage from "@/pages/CarpoolPage";
import FinancialReportsPage from "@/pages/FinancialReportsPage";
import OtherIncomePage from "@/pages/OtherIncomePage";
import SchoolExpensePage from "@/pages/SchoolExpensePage";
import StudentsPage from "@/pages/Students/StudentsPage";
import useLayoutStore from "@/stores/layoutStore";
import TuitionPage from "@/pages/Tuition/TuitionPage";

const OutletComp = () => {
  const activeNav = useLayoutStore((s) => s.activeNav);
  const setActiveNav = useLayoutStore((s) => s.setActiveNav);

  switch (activeNav) {
    case DASHBOARD:
      return <DashboardPage />;
    case STUDENTS:
      return <StudentsPage />;
    case TUITION:
      return <TuitionPage />;
    case CARPOOL:
      return <CarpoolPage />;
    case OTHER_INCOME:
      return <OtherIncomePage />;
    case TMPCCI_EXPENSES:
      return <SchoolExpensePage />;
    case CARPOOL_EXPENSES:
      return <CarpoolExpensePage />;
    case FINANCIAL_REPORTS:
      return <FinancialReportsPage />;
    default:
      setActiveNav(DASHBOARD);
      return <DashboardPage />;
  }
};

export default OutletComp;
