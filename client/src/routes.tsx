import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import Layout from "./pages/Layout";
import DashboardPage from "./pages/DashboardPage";
import StudentsPage from "./pages/Students/StudentsPage";
import TuitionPage from "./pages/Tuition/TuitionPage";
import TuitionPaymentPage from "./pages/Tuition/TuitionPaymentPage";
import CarpoolPage from "./pages/CarpoolPage";
import OtherIncomePage from "./pages/OtherIncomePage";
import { NAVTITLE } from "./constants/side-menu";
import FinancialReportsPage from "./pages/FinancialReportsPage";
import SchoolExpensePage from "./pages/SchoolExpensePage";
import CarpoolExpensePage from "./pages/CarpoolExpensePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: NAVTITLE.DASHBOARD.url,
        element: <DashboardPage />,
      },
      {
        path: NAVTITLE.STUDENTS.url,
        element: <StudentsPage />,
      },

      {
        path: NAVTITLE.TUITION.url,
        element: <TuitionPage />,
      },
      {
        path: NAVTITLE.TUITION_PAYMENT.url,
        element: <TuitionPaymentPage />,
      },
      {
        path: NAVTITLE.CARPOOL.url,
        element: <CarpoolPage />,
      },
      {
        path: NAVTITLE.OTHER_INCOME.url,
        element: <OtherIncomePage />,
      },
      {
        path: NAVTITLE.TMPCCI_EXPENSES.url,
        element: <SchoolExpensePage />,
      },
      {
        path: NAVTITLE.CARPOOL_EXPENSES.url,
        element: <CarpoolExpensePage />,
      },
      {
        path: NAVTITLE.FINANCIAL_REPORTS.url,
        element: <FinancialReportsPage />,
      },
    ],
  },
]);

export default router;
