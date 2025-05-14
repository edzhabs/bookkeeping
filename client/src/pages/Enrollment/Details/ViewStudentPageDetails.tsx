import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Pencil,
  CalendarIcon,
  BookOpen,
  GraduationCap,
  Phone,
  MapPin,
  Users,
  CreditCard,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Student } from "@/types/student";
import type { Tuition } from "@/types/tuition";
import type { ActivityLogItem } from "@/types/activity-log";
import { logActivity } from "@/lib/activity-logger";
import { useLoading } from "@/context/loading-prover";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useParams } from "react-router-dom";

// Sample data for demonstration
const initialStudents: Student[] = [
  {
    id: "1",
    firstName: "John",
    middleName: "Robert",
    lastName: "Doe",
    suffix: "",
    gender: "Male",
    birthdate: "2010-05-15",
    schoolYear: "2023-2024",
    address: "123 Main St, Anytown, USA",
    livingWith: "Both Parents",
    contactNumbers: ["555-123-4567", "555-987-6543"],
    status: "returning",
    discount: "None",
    discountPercentage: 0,
    gradeLevel: "Grade 10",
    parents: {
      father: {
        fullName: "Robert Doe",
        job: "Engineer",
        educationAttainment: "Bachelor's Degree",
      },
      mother: {
        fullName: "Jane Doe",
        job: "Doctor",
        educationAttainment: "Doctorate",
      },
    },
  },
  {
    id: "2",
    firstName: "Emma",
    middleName: "Grace",
    lastName: "Smith",
    suffix: "",
    gender: "Female",
    birthdate: "2011-08-22",
    schoolYear: "2023-2024",
    address: "456 Oak Ave, Somewhere, USA",
    livingWith: "Mother",
    contactNumbers: ["555-222-3333"],
    status: "new",
    discount: "Sibling Discount",
    discountPercentage: 10,
    gradeLevel: "Grade 8",
    parents: {
      mother: {
        fullName: "Sarah Smith",
        job: "Teacher",
        educationAttainment: "Master's Degree",
      },
    },
  },
];

// Sample tuition data
const initialTuitions: Tuition[] = [
  {
    id: "1",
    studentId: "1",
    studentName: "John Doe",
    gradeLevel: "Grade 10",
    discount: "None",
    discountAmount: 0,
    schoolYear: "2023-2024",
    totalAmount: 50000,
    remainingBalance: 0,
    dueDate: "2023-09-15",
    status: "Paid",
    payments: [
      {
        id: "p1",
        invoiceNumber: "TUI-2023-001",
        amount: 25000,
        date: "2023-07-10",
        method: "Bank Transfer",
        notes: "First semester payment",
        reservationFee: 5000,
        tuitionFee: 20000,
        advancePayment: 0,
      },
      {
        id: "p2",
        invoiceNumber: "TUI-2023-015",
        amount: 25000,
        date: "2023-11-05",
        method: "Credit Card",
        notes: "Second semester payment",
        reservationFee: 0,
        tuitionFee: 25000,
        advancePayment: 0,
      },
    ],
  },
  {
    id: "2",
    studentId: "2",
    studentName: "Emma Smith",
    gradeLevel: "Grade 8",
    discount: "Sibling Discount",
    discountAmount: 5000,
    schoolYear: "2023-2024",
    totalAmount: 45000,
    remainingBalance: 45000,
    dueDate: "2023-09-15",
    status: "Unpaid",
    payments: [],
  },
];

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
    details: "Updated student information",
  },
];

export default function StudentDetailsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const { toast } = useToast();
  const [student, setStudent] = useState<Student | null>(null);
  const [tuitions, setTuitions] = useState<Tuition[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      showLoading("Loading student information...");

      try {
        // In a real app, you would fetch the student data from your API
        const fetchedStudent = initialStudents.find((s) => s.id === params.id);

        // Get tuitions for this student
        const studentTuitions = initialTuitions.filter(
          (t) => t.studentId === params.id
        );

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setStudent(fetchedStudent || null);
        setTuitions(studentTuitions);

        if (fetchedStudent) {
          logActivity({
            action: "Viewed",
            entityType: "Student",
            entityId: fetchedStudent.id,
            details: `Viewed student record for ${fetchedStudent.firstName} ${fetchedStudent.lastName}`,
          });
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
        toast({
          title: "Error",
          description: "Failed to load student information. Please try again.",
          variant: "destructive",
        });
      } finally {
        hideLoading();
      }
    };

    fetchData();
  }, [params.id, showLoading, hideLoading, toast]);

  const handleEditStudent = () => {
    navigate(`/enrollment/${params.id}/edit`);
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

  if (!student) {
    return (
      <div className="container py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Student Not Found</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground py-8">
              The requested student record could not be found.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center pb-6">
            <Button onClick={() => navigate("/enrollment")}>
              Return to Enrollment
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Filter activity logs for this student
  const studentLogs = sampleActivityLogs.filter(
    (log) => log.entityId === student.id
  );

  // Calculate total paid amount
  const totalPaid = tuitions.reduce((sum, tuition) => {
    return (
      sum + tuition.payments.reduce((pSum, payment) => pSum + payment.amount, 0)
    );
  }, 0);

  // Calculate total remaining balance
  const totalRemaining = tuitions.reduce(
    (sum, tuition) => sum + tuition.remainingBalance,
    0
  );

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Student Profile
            </h1>
            <p className="text-slate-500">
              View and manage student information
            </p>
          </div>
        </div>
        <Button onClick={handleEditStudent}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit Student
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl font-bold text-slate-800">
                  {student.firstName}{" "}
                  {student.middleName ? student.middleName + " " : ""}
                  {student.lastName} {student.suffix}
                </CardTitle>
                <CardDescription className="text-slate-500 mt-1">
                  {student.gradeLevel} • {student.schoolYear}
                </CardDescription>
              </div>
              <Badge
                variant={student.status === "new" ? "default" : "secondary"}
                className="capitalize text-sm"
              >
                {student.status === "new" ? "New Student" : "Returning Student"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-600">
                  Born: {new Date(student.birthdate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-600">
                  Gender: {student.gender}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-600">
                  Discount: {student.discount || "None"}{" "}
                  {student.discountPercentage
                    ? `(${student.discountPercentage}%)`
                    : ""}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-600">
                  Living with: {student.livingWith}
                </span>
              </div>
              <div className="flex items-start gap-2 md:col-span-2">
                <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                <span className="text-sm text-slate-600">
                  {student.address}
                </span>
              </div>
              {student.contactNumbers && student.contactNumbers.length > 0 && (
                <div className="flex items-start gap-2 md:col-span-2">
                  <Phone className="h-4 w-4 text-slate-400 mt-0.5" />
                  <div className="flex flex-wrap gap-2">
                    {student.contactNumbers.map((number, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-slate-600"
                      >
                        {number}
                      </Badge>
                    ))}
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
                  ₱
                  {tuitions
                    .reduce((sum, t) => sum + t.totalAmount, 0)
                    .toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Paid</p>
                <p className="text-2xl font-bold text-emerald-600">
                  ₱{totalPaid.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Remaining Balance</p>
                <p className="text-2xl font-bold text-amber-600">
                  ₱{totalRemaining.toLocaleString()}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-slate-500">Payment Status</p>
                <div className="mt-1">
                  {totalRemaining === 0 ? (
                    <Badge variant="success" className="text-sm">
                      Fully Paid
                    </Badge>
                  ) : totalPaid > 0 ? (
                    <Badge variant="warning" className="text-sm">
                      Partial Payment
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="text-sm">
                      Unpaid
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          {totalRemaining > 0 && (
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => handleMakePayment(tuitions[0]?.id)}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Make Payment
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="details">Student Information</TabsTrigger>
          <TabsTrigger value="parents">Parents Information</TabsTrigger>
          <TabsTrigger value="tuition">Tuition Records</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
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
                      <p className="text-sm text-slate-600">
                        {student.firstName} {student.middleName}{" "}
                        {student.lastName} {student.suffix}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Gender</p>
                      <p className="text-sm text-slate-600">{student.gender}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Birthdate</p>
                      <p className="text-sm text-slate-600">
                        {new Date(student.birthdate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Living With</p>
                      <p className="text-sm text-slate-600">
                        {student.livingWith || "Not specified"}
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
                        {student.schoolYear}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Grade Level</p>
                      <p className="text-sm text-slate-600">
                        {student.gradeLevel}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Discount</p>
                      <p className="text-sm text-slate-600">
                        {student.discount || "None"}{" "}
                        {student.discountPercentage
                          ? `(${student.discountPercentage}%)`
                          : ""}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Status</p>
                      <p className="text-sm text-slate-600 capitalize">
                        {student.status || "New"} Student
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
                    <p className="text-sm text-slate-600">{student.address}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Contact Numbers</p>
                    {student.contactNumbers &&
                    student.contactNumbers.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {student.contactNumbers.map((number, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-slate-600"
                          >
                            {number}
                          </Badge>
                        ))}
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
              {student.parents.father && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-slate-500">Father</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-sm font-medium">Name</p>
                      <p className="text-sm text-slate-600">
                        {student.parents.father.fullName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Occupation</p>
                      <p className="text-sm text-slate-600">
                        {student.parents.father.job || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Education</p>
                      <p className="text-sm text-slate-600">
                        {student.parents.father.educationAttainment ||
                          "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {student.parents.mother && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-slate-500">Mother</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-sm font-medium">Name</p>
                      <p className="text-sm text-slate-600">
                        {student.parents.mother.fullName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Occupation</p>
                      <p className="text-sm text-slate-600">
                        {student.parents.mother.job || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Education</p>
                      <p className="text-sm text-slate-600">
                        {student.parents.mother.educationAttainment ||
                          "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {!student.parents.father && !student.parents.mother && (
                <p className="text-center text-slate-500 py-4">
                  No parent information available.
                </p>
              )}
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
                            {tuition.schoolYear}
                          </TableCell>
                          <TableCell className="text-slate-700">
                            {tuition.gradeLevel}
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
                                schoolYear: tuition.schoolYear,
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
    </div>
  );
}
