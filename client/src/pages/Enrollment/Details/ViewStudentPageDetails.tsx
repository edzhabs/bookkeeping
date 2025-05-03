"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import type { Student } from "@/types/student";
import type { Tuition } from "@/types/tuition";
import type { ActivityLogItem } from "@/types/activity-log";
import { logActivity } from "@/lib/activity-logger";
import { useNavigate, useParams } from "react-router-dom";

// Sample data for demonstration
const initialStudents: Student[] = [
  {
    id: "1",
    firstName: "John",
    middleName: "Robert",
    lastName: "Doe",
    gender: "Male",
    birthdate: "2010-05-15",
    schoolYear: "2023-2024",
    suffix: "",
    livingWith: "Both Parents",
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
    gender: "Female",
    birthdate: "2011-08-22",
    schoolYear: "2023-2024",
    suffix: "",
    livingWith: "Mother",
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

export default function ViewStudentDetailsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch the student data from your API
    const fetchedStudent = initialStudents.find((s) => s.id === params.id);
    setStudent(fetchedStudent || null);

    // Get tuitions for this student
    const studentTuitions = initialTuitions.filter(
      (t) => t.studentId === params.id
    );
    setTuitions(studentTuitions);

    setIsLoading(false);

    if (fetchedStudent) {
      logActivity({
        action: "Viewed",
        entityType: "Student",
        entityId: fetchedStudent.id,
        details: `Viewed student record for ${fetchedStudent.firstName} ${fetchedStudent.lastName}`,
      });
    }
  }, [params.id]);

  const handleEditStudent = () => {
    navigate(`/enrollment/${params.id}/edit`);
  };

  const handleViewTuition = (tuitionId: string) => {
    navigate(`/tuitions/${tuitionId}`);
  };

  const handleViewTransaction = (paymentId: string) => {
    navigate(`/transactions/${paymentId}`);
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Loading...</h1>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="container py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Student Not Found</h1>
        </div>
        <p>The requested student record could not be found.</p>
      </div>
    );
  }

  // Filter activity logs for this student
  const studentLogs = sampleActivityLogs.filter(
    (log) => log.entityId === student.id
  );

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Student Details</h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleEditStudent}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Student
          </Button>
          <Button
            variant="destructive"
            onClick={() => console.log("delete click")}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Student Name</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {student.firstName}{" "}
              {student.middleName ? student.middleName.charAt(0) + ". " : ""}
              {student.lastName} {student.suffix}
            </p>
            <p className="text-sm text-muted-foreground">
              {student.gradeLevel}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">School Year</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{student.schoolYear}</p>
            <p className="text-sm text-muted-foreground">
              Discount: {student.discount} ({student.discountPercentage}%)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">{student.gender}</p>
            <p className="text-sm text-muted-foreground">
              Born: {new Date(student.birthdate).toLocaleDateString()}
            </p>
          </CardContent>
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
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium">Full Name</p>
                <p className="text-sm text-muted-foreground">
                  {student.firstName} {student.middleName} {student.lastName}{" "}
                  {student.suffix}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Gender</p>
                <p className="text-sm text-muted-foreground">
                  {student.gender}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Birthdate</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(student.birthdate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">School Year</p>
                <p className="text-sm text-muted-foreground">
                  {student.schoolYear}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Grade Level</p>
                <p className="text-sm text-muted-foreground">
                  {student.gradeLevel}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Living With</p>
                <p className="text-sm text-muted-foreground">
                  {student.livingWith || "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Discount</p>
                <p className="text-sm text-muted-foreground">
                  {student.discount || "None"} (
                  {student.discountPercentage || 0}%)
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="parents" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Parents Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {student.parents.father && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Father</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-sm font-medium">Name</p>
                      <p className="text-sm text-muted-foreground">
                        {student.parents.father.fullName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Occupation</p>
                      <p className="text-sm text-muted-foreground">
                        {student.parents.father.job || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Education</p>
                      <p className="text-sm text-muted-foreground">
                        {student.parents.father.educationAttainment ||
                          "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {student.parents.mother && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Mother</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-sm font-medium">Name</p>
                      <p className="text-sm text-muted-foreground">
                        {student.parents.mother.fullName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Occupation</p>
                      <p className="text-sm text-muted-foreground">
                        {student.parents.mother.job || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Education</p>
                      <p className="text-sm text-muted-foreground">
                        {student.parents.mother.educationAttainment ||
                          "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {!student.parents.father && !student.parents.mother && (
                <p className="text-center text-muted-foreground py-4">
                  No parent information available.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tuition" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Tuition Records</CardTitle>
            </CardHeader>
            <CardContent>
              {tuitions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>School Year</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Remaining</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tuitions.map((tuition) => (
                      <TableRow key={tuition.id}>
                        <TableCell>{tuition.schoolYear}</TableCell>
                        <TableCell>
                          ₱{tuition.totalAmount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          ₱{tuition.remainingBalance.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              tuition.status === "Paid"
                                ? "default"
                                : tuition.status === "Partial"
                                ? "outline"
                                : "destructive"
                            }
                          >
                            {tuition.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewTuition(tuition.id)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No tuition records found.
                </p>
              )}
            </CardContent>
          </Card>

          {tuitions.length > 0 && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tuitions.flatMap((tuition) => tuition.payments).length >
                    0 ? (
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
                        .map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell className="font-medium">
                              {payment.invoiceNumber}
                            </TableCell>
                            <TableCell>
                              {new Date(payment.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              ₱{payment.amount.toLocaleString()}
                            </TableCell>
                            <TableCell>{payment.method}</TableCell>
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
                        <TableCell colSpan={5} className="h-24 text-center">
                          No payment records found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="activity" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        No activity logs found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    studentLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
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
                          >
                            {log.action}
                          </Badge>
                        </TableCell>
                        <TableCell>{log.user}</TableCell>
                        <TableCell>{log.details}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
