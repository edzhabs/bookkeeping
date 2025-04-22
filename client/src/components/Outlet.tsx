import { DASHBOARD, STUDENTS } from "@/constants/side-menu";
import DashboardPage from "@/pages/DashboardPage";
import StudentsPage from "@/pages/Students/StudentsPage";
import useLayoutStore from "@/stores/layoutStore";

const OutletComp = () => {
  const activeNav = useLayoutStore((s) => s.activeNav);
  const setActiveNav = useLayoutStore((s) => s.setActiveNav);

  switch (activeNav) {
    case DASHBOARD:
      return <DashboardPage />;
    case STUDENTS:
      return <StudentsPage />;
    default:
      setActiveNav(DASHBOARD);
      return <DashboardPage />;
  }
};

export default OutletComp;
