import { DeleteConfirmation } from "@/components/delete-confirmation";
import { DeleteVerification } from "@/components/delete-verification";
import { EditConfirmation } from "@/components/edit-confirmation";
import { ErrorComponent } from "@/components/Errors/error";
import { RecordNotFound } from "@/components/Errors/record-notFound";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLoading } from "@/context/loading-prover";
import { useDeleteEnrollmentMutation } from "@/hooks/useDeleteEnrollmentMutation";
import { fetchEnrollmentDetails } from "@/services/enrollments";
import type { ActivityLogItem } from "@/types/activity-log";
import { StudentEnrollmentDetails } from "@/types/enrollment";
import type { Tuition } from "@/types/tuition";
import {
  displayDiscounts,
  formatBirthDate,
  formatFullName,
  formatToCurrency,
} from "@/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  ArrowLeft,
  BookOpen,
  CalendarIcon,
  CreditCard,
  GraduationCap,
  MapPin,
  MoreVertical,
  Pencil,
  Phone,
  Trash2,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Sample activity logs
const sampleActivityLogs: ActivityLogItem[] = [
  {
    id: "1",
    action: "Created",
    entityType: "Student",
    entityId: "1",
    timestamp: new Date().toISOString(),
    user: "Admin User",
    details: "Student record was created",
  },
  {
    id: "2",
    action: "Updated",
    entityType: "Student",
    entityId: "1",
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    user: "Admin User",
    details: "Updated enrollment.student information",
  },
];

export default function StudentDetailsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();

  const [showEditConfirmation, setShowEditConfirmation] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showDeleteVerification, setShowDeleteVerification] = useState(false);

  const [tuitions, setTuitions] = useState<Tuition[]>([]);

  const { data, isLoading, isError, error } = useQuery<{
    data: StudentEnrollmentDetails;
  }>({
    queryKey: ["enrollment", params.id],
    queryFn: () => fetchEnrollmentDetails(params.id),
  });
  const enrollment = data?.data;

  useEffect(() => {
    if (isLoading) {
      showLoading();
    } else {
      hideLoading();
    }
  }, [isLoading, showLoading, hideLoading]);

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

  const handleMakePayment = (tuitionId: string) => {
    navigate(`/tuitions/${tuitionId}/payment`);
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

  if (!enrollment || isError) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
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

  const studentLogs = sampleActivityLogs.filter(
    (log) => log.entityId === enrollment?.id
  );

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
              View and manage enrollment.student information
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
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl font-bold text-slate-800 capitalize">
                  {formatFullName(enrollment.student)}
                </CardTitle>
                <CardDescription className="text-slate-500 mt-1 capitalize">
                  {enrollment.grade_level} • {enrollment.school_year}
                </CardDescription>
              </div>
              <Badge
                variant={enrollment.type === "new" ? "default" : "secondary"}
                className="capitalize text-sm"
              >
                {enrollment.type === "new" ? "New Student" : "Old Student"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-600">
                  Born: {formatBirthDate(enrollment.student.birthdate || "")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-600">
                  Discount:{" "}
                  {enrollment.discount_types.length > 0
                    ? displayDiscounts(enrollment.discount_types)
                    : "None"}{" "}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-600 capitalize">
                  Gender: {enrollment.student.gender}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-600 capitalize">
                  Living with: {enrollment.student.living_with}
                </span>
              </div>
              <div className="flex items-start gap-2 md:col-span-2">
                <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                <span className="text-sm text-slate-600 capitalize">
                  {enrollment.student.address}
                </span>
              </div>
              {enrollment.student.contact_numbers &&
                enrollment.student.contact_numbers.length > 0 && (
                  <div className="flex items-start gap-2 md:col-span-2">
                    <Phone className="h-4 w-4 text-slate-400 mt-0.5" />
                    <div className="flex flex-wrap gap-2">
                      {enrollment.student.contact_numbers.map(
                        (number, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-slate-600 hover:bg-slate-100"
                          >
                            {number}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-slate-800">
              Financial Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-500">Total Tuition</p>
                <p className="text-2xl font-bold text-slate-800">
                  {formatToCurrency(enrollment.total_amount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Paid</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {formatToCurrency(enrollment.total_paid)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Remaining Balance</p>
                <p className="text-2xl font-bold text-amber-600">
                  {formatToCurrency(enrollment.remaining_amount)}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-slate-500">Payment Status</p>
                <div className="mt-1">
                  {enrollment.payment_status === "paid" && (
                    <Badge variant="success" className="text-sm">
                      Fully Paid
                    </Badge>
                  )}
                  {enrollment.payment_status === "partial" && (
                    <Badge variant="warning" className="text-sm">
                      Partial Payment
                    </Badge>
                  )}
                  {enrollment.payment_status === "unpaid" && (
                    <Badge variant="destructive" className="text-sm">
                      Unpaid
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          {Number(enrollment.remaining_amount) > 0 && (
            <CardFooter className="mt-4">
              <Button
                className="w-full cursor-pointer"
                onClick={() => handleMakePayment(tuitions[0]?.id)}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Make Payment
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>

      <Tabs defaultValue="details" className="w-full scrollable-tabs">
        <TabsList className="w-full mb-4 flex overflow-x-auto pb-px">
          <TabsTrigger value="details" className="flex-shrink-0">
            Student Information
          </TabsTrigger>
          <TabsTrigger value="parents" className="flex-shrink-0">
            Parents Information
          </TabsTrigger>
          <TabsTrigger value="tuition" className="flex-shrink-0">
            Tuition Records
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex-shrink-0">
            Activity Log
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-2">
                    Personal Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium">Full Name</p>
                      <p className="text-sm text-slate-600 capitalize">
                        {formatFullName(enrollment.student)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Gender</p>
                      <p className="text-sm text-slate-600 capitalize">
                        {enrollment.student.gender}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Birthdate</p>
                      <p className="text-sm text-slate-600">
                        {formatBirthDate(enrollment.student.birthdate || "")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Living With</p>
                      <p className="text-sm text-slate-600">
                        {enrollment.student.living_with || "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-2">
                    Academic Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium">School Year</p>
                      <p className="text-sm text-slate-600">
                        {enrollment.school_year}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Grade Level</p>
                      <p className="text-sm text-slate-600 capitalize">
                        {enrollment.grade_level}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Discount</p>
                      <p className="text-sm text-slate-600">
                        {displayDiscounts(enrollment.discount_types)}{" "}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Status</p>
                      <p className="text-sm text-slate-600 capitalize">
                        {enrollment.type || "New"} Student
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-sm font-medium text-slate-500 mb-2">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">Address</p>
                    <p className="text-sm text-slate-600">
                      {enrollment.student.address}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Contact Numbers</p>
                    {enrollment.student.contact_numbers &&
                    enrollment.student.contact_numbers.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {enrollment.student.contact_numbers.map(
                          (number, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-slate-600 hover:bg-slate-100"
                            >
                              {number}
                            </Badge>
                          )
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-600">
                        No contact numbers provided
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="parents" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Parents Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-slate-500">Father</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm font-medium">Name</p>
                    <p className="text-sm text-slate-600 capitalize">
                      {enrollment.student.father_name || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Occupation</p>
                    <p className="text-sm text-slate-600 capitalize">
                      {enrollment.student.father_job || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Education</p>
                    <p className="text-sm text-slate-600 capitalize">
                      {enrollment.student.father_education || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-slate-500">Mother</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm font-medium">Name</p>
                    <p className="text-sm text-slate-600 capitalize">
                      {enrollment.student.mother_name || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Occupation</p>
                    <p className="text-sm text-slate-600 capitalize">
                      {enrollment.student.mother_job || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Education</p>
                    <p className="text-sm text-slate-600 capitalize">
                      {enrollment.student.mother_education || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tuition" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Tuition Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tuitions.length > 0 ? (
                <div className="rounded-md border shadow-sm overflow-hidden">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow className="hover:bg-slate-100 border-b border-slate-200">
                        <TableHead className="font-semibold text-slate-700 h-11">
                          School Year
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700">
                          Grade Level
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700">
                          Total Amount
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700">
                          Remaining
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700">
                          Status
                        </TableHead>
                        <TableHead className="text-right font-semibold text-slate-700">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tuitions.map((tuition, index) => (
                        <TableRow
                          key={tuition.id}
                          className={`
                            ${index % 2 === 0 ? "bg-white" : "bg-slate-50"} 
                            hover:bg-slate-100 transition-colors
                            border-b border-slate-200 last:border-0
                          `}
                        >
                          <TableCell className="text-slate-700">
                            {tuition.school_year}
                          </TableCell>
                          <TableCell className="text-slate-700">
                            {tuition.grade_level}
                          </TableCell>
                          <TableCell className="text-slate-700 font-medium">
                            ₱{tuition.totalAmount.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-slate-700">
                            ₱{tuition.remainingBalance.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                tuition.status === "Paid"
                                  ? "success"
                                  : tuition.status === "Partial"
                                  ? "warning"
                                  : "destructive"
                              }
                              className="font-medium"
                            >
                              {tuition.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewTuition(tuition.id)}
                              >
                                View
                              </Button>
                              {tuition.status !== "Paid" && (
                                <Button
                                  size="sm"
                                  onClick={() => handleMakePayment(tuition.id)}
                                >
                                  Pay
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-center text-slate-500 py-4">
                  No tuition records found.
                </p>
              )}
            </CardContent>
          </Card>

          {tuitions.length > 0 &&
            tuitions.some((t) => t.payments.length > 0) && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Payment History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border shadow-sm overflow-hidden">
                    <Table>
                      <TableHeader className="bg-slate-50">
                        <TableRow className="hover:bg-slate-100 border-b border-slate-200">
                          <TableHead className="font-semibold text-slate-700 h-11">
                            Invoice #
                          </TableHead>
                          <TableHead className="font-semibold text-slate-700">
                            Date
                          </TableHead>
                          <TableHead className="font-semibold text-slate-700">
                            Amount
                          </TableHead>
                          <TableHead className="font-semibold text-slate-700">
                            Method
                          </TableHead>
                          <TableHead className="text-right font-semibold text-slate-700">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tuitions.flatMap((tuition) => tuition.payments)
                          .length > 0 ? (
                          tuitions
                            .flatMap((tuition) =>
                              tuition.payments.map((payment) => ({
                                ...payment,
                                tuitionId: tuition.id,
                                school_year: tuition.school_year,
                              }))
                            )
                            .sort(
                              (a, b) =>
                                new Date(b.date).getTime() -
                                new Date(a.date).getTime()
                            )
                            .map((payment, index) => (
                              <TableRow
                                key={payment.id}
                                className={`
                                ${index % 2 === 0 ? "bg-white" : "bg-slate-50"} 
                                hover:bg-slate-100 transition-colors
                                border-b border-slate-200 last:border-0
                              `}
                              >
                                <TableCell className="font-medium text-slate-800">
                                  {payment.invoiceNumber}
                                </TableCell>
                                <TableCell className="text-slate-700">
                                  {new Date(payment.date).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-slate-700 font-medium">
                                  ₱{payment.amount.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-slate-700">
                                  {payment.method}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleViewTransaction(payment.id)
                                    }
                                  >
                                    View
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              className="h-24 text-center text-slate-500"
                            >
                              No payment records found.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}
        </TabsContent>

        <TabsContent value="activity" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Activity Log
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border shadow-sm overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow className="hover:bg-slate-100 border-b border-slate-200">
                      <TableHead className="font-semibold text-slate-700 h-11">
                        Date & Time
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        Action
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        User
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        Details
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentLogs.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="h-24 text-center text-slate-500"
                        >
                          No activity logs found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      studentLogs.map((log, index) => (
                        <TableRow
                          key={log.id}
                          className={`
                            ${index % 2 === 0 ? "bg-white" : "bg-slate-50"} 
                            hover:bg-slate-100 transition-colors
                            border-b border-slate-200 last:border-0
                          `}
                        >
                          <TableCell className="text-slate-700">
                            {new Date(log.timestamp).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                log.action === "Created"
                                  ? "default"
                                  : log.action === "Updated"
                                  ? "outline"
                                  : log.action === "Deleted"
                                  ? "destructive"
                                  : "secondary"
                              }
                              className="font-medium"
                            >
                              {log.action}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-700">
                            {log.user}
                          </TableCell>
                          <TableCell className="text-slate-700">
                            {log.details}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
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
    </div>
  );
}
