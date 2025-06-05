import { ActivityLog } from "@/components/activity-log";
import { DeleteConfirmation } from "@/components/delete-confirmation";
import { DeleteVerification } from "@/components/delete-verification";
import { EditConfirmation } from "@/components/edit-confirmation";
import { ErrorComponent } from "@/components/Errors/error";
import { RecordNotFound } from "@/components/Errors/record-notFound";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLoading } from "@/context/loading-prover";
import { useDeleteEnrollmentMutation } from "@/hooks/useDeleteEnrollmentMutation";
import useEnrollmentDetails from "@/hooks/useEnrollmentDetailsQuery";
import type { Tuition } from "@/types/tuition";
import { formatFullName } from "@/utils";
import axios from "axios";
import { ArrowLeft, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FinancialSummaryComp from "./components/FinancialSummaryComp";
import StudentInfoComp from "./components/StudentInfoComp";
import StudentSummaryComp from "./components/StudentSummaryComp";
import TuitionInformationComp from "./components/TuitionInformationComp";
import { ActivityLogItem } from "@/types/activity-log";
import useTuitionDetailsQuery from "@/hooks/useTuitionDetailsQuery";
import PaymentRecordsComp from "./components/PaymentRecordsComp";
import { PaymentSelectionModal } from "@/components/payment-modal";
import useEnrollmentInfoStore from "@/stores/useEnrollmentInfoStore";

const sampleActivityLogs: ActivityLogItem[] = [
  {
    id: "a1",
    action: "Created",
    entityType: "Tuition",
    entityId: "1",
    timestamp: "2023-08-01T10:30:00Z",
    user: "admin@school.edu",
    details: "Created tuition record for John Smith for school year 2023-2024",
  },
  {
    id: "a2",
    action: "Updated",
    entityType: "Tuition",
    entityId: "1",
    timestamp: "2023-08-10T14:15:00Z",
    user: "finance@school.edu",
    details: "Recorded payment of ₱5,000",
  },
  {
    id: "a3",
    action: "Updated",
    entityType: "Tuition",
    entityId: "1",
    timestamp: "2023-09-15T09:20:00Z",
    user: "finance@school.edu",
    details: "Recorded payment of ₱3,000",
  },
  {
    id: "a4",
    action: "Updated",
    entityType: "Tuition",
    entityId: "1",
    timestamp: "2023-10-20T16:45:00Z",
    user: "finance@school.edu",
    details: "Recorded payment of ₱2,000",
  },
  {
    id: "a5",
    action: "Updated",
    entityType: "Tuition",
    entityId: "1",
    timestamp: "2023-11-25T11:30:00Z",
    user: "finance@school.edu",
    details: "Recorded payment of ₱1,500",
  },
  {
    id: "a6",
    action: "Updated",
    entityType: "Tuition",
    entityId: "1",
    timestamp: "2023-12-30T13:15:00Z",
    user: "finance@school.edu",
    details: "Recorded payment of ₱1,000",
  },
  {
    id: "a7",
    action: "Updated",
    entityType: "Tuition",
    entityId: "1",
    timestamp: "2024-01-15T10:00:00Z",
    user: "finance@school.edu",
    details: "Recorded payment of ₱800",
  },
  {
    id: "a8",
    action: "Updated",
    entityType: "Tuition",
    entityId: "1",
    timestamp: "2024-02-20T14:30:00Z",
    user: "finance@school.edu",
    details: "Recorded payment of ₱700",
  },
  {
    id: "a9",
    action: "Viewed",
    entityType: "Tuition",
    entityId: "1",
    timestamp: "2024-03-01T09:15:00Z",
    user: "admin@school.edu",
    details: "Viewed tuition details",
  },
  {
    id: "a10",
    action: "Exported",
    entityType: "Tuition",
    entityId: "1",
    timestamp: "2024-03-05T11:45:00Z",
    user: "admin@school.edu",
    details: "Exported payment history to PDF",
  },
];

export default function StudentDetailsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const { setEnrollmentInfo } = useEnrollmentInfoStore();

  const [showEditConfirmation, setShowEditConfirmation] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showDeleteVerification, setShowDeleteVerification] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const enrollmentQuery = useEnrollmentDetails(params?.id);
  // const tuitionQuery = useTuitionDetailsQuery(params?.id);
  const enrollment = enrollmentQuery?.data?.data;
  // const tuition = tuitionQuery.data?.data;

  useEffect(() => {
    if (enrollmentQuery.isLoading) {
      showLoading();
    } else {
      hideLoading();
    }
  }, [
    enrollmentQuery.isLoading,
    // tuitionQuery.isLoading,
    showLoading,
    hideLoading,
  ]);

  const handleEditStudent = () => {
    navigate(`/enrollment/${params.id}/edit`);
  };

  const handleEditCancel = () => {
    setShowEditConfirmation(false);
  };

  const handleDeleteConfirm = () => {
    setShowDeleteConfirmation(false);
    setShowDeleteVerification(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirmation(false);
  };

  const handleDeleteVerificationCancel = () => {
    setShowDeleteVerification(false);
  };

  const handleViewTuition = (tuitionId: string) => {
    navigate(`/tuitions/${tuitionId}`);
  };

  const handleViewTransaction = (paymentId: string) => {
    navigate(`/transactions/${paymentId}`);
  };

  const handleMakePayment = () => {
    setShowPaymentModal(true);
  };

  const handleTuitionPayment = () => {
    setShowPaymentModal(false);
    showLoading();
    setTimeout(() => {
      setEnrollmentInfo({
        enrollment_id: enrollment?.id || "",
        student_id: enrollment?.student.id || "",
        school_year: enrollment?.school_year || "",
        grade_level: enrollment?.grade_level || "",
        total_tuition_amount_due: enrollment?.total_tuition_amount_due || "",
        total_tuition_paid: enrollment?.total_tuition_paid || "",
        tuition_balance: enrollment?.tuition_balance || "",
      });
      navigate("/tuition_payment");
    }, 0);
  };

  const handleOtherPayment = () => {
    showLoading();
    setShowPaymentModal(false);
    const params = new URLSearchParams({
      enrollmentID: enrollment!.id,
      schoolYear: enrollment!.school_year,
      gradeLevel: enrollment!.grade_level,
    });
    navigate(`/other_payment?${params.toString()}`);
  };

  const mutation = useDeleteEnrollmentMutation(
    enrollment?.student.first_name,
    enrollment?.student.last_name
  );

  const handleDeleteVerificationConfirm = async () => {
    setShowDeleteVerification(false);
    showLoading("Deleting student record...");

    mutation.mutate(params.id);
  };

  if (!enrollment || enrollmentQuery.isError) {
    if (
      axios.isAxiosError(enrollmentQuery.error) &&
      enrollmentQuery.error.response?.status === 404
    ) {
      const entity = params.id ? `Enrollment ID: ${params.id}` : undefined;
      return (
        <RecordNotFound
          entityType="enrollment"
          entityName={entity}
          backHref="/enrollment"
          listHref="/enrollment"
        />
      );
    } else {
      return <ErrorComponent />;
    }
  }

  const getStatusColor = (status: string | undefined) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-emerald-100 text-emerald-800 hover:bg-emerald-200";
      case "unpaid":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "partial":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      default:
        return "bg-slate-100 text-slate-800 hover:bg-slate-200";
    }
  };

  return (
    <div className="container py-8">
      <div className="flex flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Student Profile
            </h1>
            <p className="text-slate-500">
              View and manage enrollment information
            </p>
          </div>
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setShowEditConfirmation(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Student
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowDeleteConfirmation(true)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Student
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <StudentSummaryComp enrollment={enrollment} />

        <FinancialSummaryComp
          enrollment={enrollment}
          handleMakePayment={handleMakePayment}
        />
      </div>

      <Tabs defaultValue="details" className="w-full scrollable-tabs">
        <TabsList className="w-full mb-4 flex overflow-x-auto pb-px">
          <TabsTrigger value="details" className="flex-shrink-0">
            Student Information
          </TabsTrigger>
          <TabsTrigger value="tuition" className="flex-shrink-0">
            Tuition Information
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex-shrink-0">
            Payment Records
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex-shrink-0">
            Activity Log
          </TabsTrigger>
        </TabsList>

        <StudentInfoComp enrollment={enrollment} />
        <TuitionInformationComp
          enrollment={enrollment}
          getStatusColor={getStatusColor}
        />
        <PaymentRecordsComp enrollmentID={params.id} />

        <ActivityLog activityLogs={sampleActivityLogs} />
      </Tabs>

      {/* Edit Confirmation Modal */}
      <EditConfirmation
        isOpen={showEditConfirmation}
        onClose={handleEditCancel}
        onConfirm={handleEditStudent}
        title="Edit Student Record"
        description="You are about to edit this student's information. Any changes you make will be saved to the system."
        studentName={formatFullName(enrollment.student)}
      />

      {/* First Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={showDeleteConfirmation}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Student"
        description={`Are you sure you want to delete ${formatFullName(
          enrollment.student
        )}? This action cannot be undone.`}
      />

      {/* Second Delete Verification Modal */}
      <DeleteVerification
        isOpen={showDeleteVerification}
        onClose={handleDeleteVerificationCancel}
        onConfirm={handleDeleteVerificationConfirm}
        title="Verify Deletion"
        description="This is a permanent action that will delete all student data including enrollment records, tuition information, and payment history. Please confirm by typing the student's last name below."
        verificationText={enrollment.student.last_name}
        verificationLabel={`Type "${enrollment.student.last_name}" to confirm deletion:`}
        placeholder="Enter student's last name"
      />

      {/* Payment option modal */}
      <PaymentSelectionModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSelectTuition={handleTuitionPayment}
        onSelectOther={handleOtherPayment}
        studentName={enrollment.student.full_name || ""}
      />
    </div>
  );
}
