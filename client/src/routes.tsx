import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import Layout from "./pages/Layout";
import DashboardPage from "./pages/DashboardPage";
import TuitionPage from "./pages/Tuition/TuitionPage";
import CarpoolPage from "./pages/Carpool/CarpoolPage";
import OtherIncomePage from "./pages/OtherIncomePage";
import { NAVTITLE } from "./constants/side-menu";
import FinancialReportsPage from "./pages/FinancialReportsPage";
import SchoolExpensePage from "./pages/SchoolExpensePage";
import CarpoolExpensePage from "./pages/CarpoolExpensePage";
import EnrollmentPage from "./pages/Enrollment/EnrollmentPage";
import TransactionsPage from "./pages/Transaction/TransactionPage";
import ViewStudentDetailsPage from "./pages/Enrollment/Details/ViewStudentPageDetails";
import EditStudentDetailsPage from "./pages/Enrollment/Details/EditStudentPageDetails";
import TuitionDetailsPage from "./pages/Tuition/ViewTuitionPage";
import TransactionDetailsPage from "./pages/Transaction/TransactionDetailsPage";
import ArchivePage from "./pages/Archive/ArchivePage";
import ArchiveDetailsPage from "./pages/Archive/ArchiveDetailsPage";
import NewEnrollmentPage from "./pages/Enrollment/EnrollNewStudentPage";
import OldEnrollmentPage from "./pages/Enrollment/EnrollOldStudentPage";

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
      // Enrollment
      {
        path: NAVTITLE.ENROLLMENTS.url,
        element: <EnrollmentPage />,
      },
      {
        path: NAVTITLE.ENROLL_NEW_STUDENT.url,
        element: <NewEnrollmentPage />,
      },
      {
        path: NAVTITLE.ENROLL_OLD_STUDENT.url,
        element: <OldEnrollmentPage />,
      },
      {
        path: NAVTITLE.VIEW_STUDENT_DETAILS.url,
        element: <ViewStudentDetailsPage />,
      },
      {
        path: NAVTITLE.EDIT_STUDENT_DETAILS.url,
        element: <EditStudentDetailsPage />,
      },
      // Tuition
      {
        path: NAVTITLE.TUITION.url,
        element: <TuitionPage />,
      },
      {
        path: NAVTITLE.TUITION_DETAILS.url,
        element: <TuitionDetailsPage />,
      },
      // Carpool
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
      // Transactions
      {
        path: NAVTITLE.TRANSACTIONS.url,
        element: <TransactionsPage />,
      },
      {
        path: NAVTITLE.TRANSACTIONS_DETAILS.url,
        element: <TransactionDetailsPage />,
      },
      // Archive
      {
        path: NAVTITLE.ARCHIVE.url,
        element: <ArchivePage />,
      },
      {
        path: NAVTITLE.ARCHIVE_DETAILS.url,
        element: <ArchiveDetailsPage />,
      },
    ],
  },
]);

export default router;
