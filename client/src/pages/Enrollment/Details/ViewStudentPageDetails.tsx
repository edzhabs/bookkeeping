import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchStudentDetails } from "@/services/students";
import type { ActivityLogItem } from "@/types/activity-log";
import { StudentEnrollmentDetails } from "@/types/enrollment";
import type { Tuition } from "@/types/tuition";
import { displayDiscounts, formatBirthDate } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Pencil } from "lucide-react";
import { useState } from "react";
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
    details: "Updated student information",
  },
];

export default function StudentDetailsPage() {
  const params = useParams();
  const navigate = useNavigate();

  const [tuitions, setTuitions] = useState<Tuition[]>([]);

  const { data } = useQuery<{ data: StudentEnrollmentDetails }>({
    queryKey: ["enrollment", params.id],
    queryFn: () => fetchStudentDetails(params.id),
  });

  const enrollment = data?.data;

  const handleEditStudent = () => {
    navigate(`/enrollment/${params.id}/edit`);
  };

  const handleViewTuition = (tuitionId: string) => {
    navigate(`/tuitions/${tuitionId}`);
  };

  const handleViewTransaction = (paymentId: string) => {
    navigate(`/transactions/${paymentId}`);
  };

  if (!enrollment) {
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

  const studentLogs = sampleActivityLogs.filter(
    (log) => log.entityId === enrollment.id
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
        <Button onClick={handleEditStudent}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit Student
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Student Name</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {enrollment?.student.first_name}{" "}
              {enrollment?.student.middle_name
                ? enrollment?.student.middle_name.charAt(0) + ". "
                : ""}
              {enrollment?.student.last_name} {enrollment?.student.suffix}
            </p>
            <p className="text-sm text-muted-foreground capitalize">
              {enrollment?.grade_level}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">School Year</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{enrollment?.school_year}</p>
            <p className="text-sm text-muted-foreground">
              Discount: {displayDiscounts(enrollment.discount_types)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg capitalize">{enrollment?.student.gender}</p>
            <p className="text-sm text-muted-foreground">
              Born: {formatBirthDate(enrollment?.student.birthdate)}
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
            <CardContent className="grid pt-2 md:grid-cols-2">
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium">First Name</p>
                  <p className="text-sm text-muted-foreground">
                    {enrollment?.student.first_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Middle Name</p>
                  <p className="text-sm text-muted-foreground">
                    {enrollment?.student.middle_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Last Name</p>
                  <p className="text-sm text-muted-foreground">
                    {enrollment?.student.last_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Suffix</p>
                  <p className="text-sm text-muted-foreground">
                    {enrollment?.student.suffix || "--"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Gender</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {enrollment?.student.gender}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium">Birthdate</p>
                  <p className="text-sm text-muted-foreground">
                    {formatBirthDate(enrollment?.student.birthdate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">
                    {enrollment?.student.address || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Living With</p>
                  <p className="text-sm text-muted-foreground">
                    {enrollment?.student.living_with || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Grade Level</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {enrollment?.grade_level}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">School Year</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {enrollment?.school_year}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="parents" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Parents Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Father</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm font-medium">Name</p>
                    <p className="text-sm text-muted-foreground">
                      {enrollment?.student.father_name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Occupation</p>
                    <p className="text-sm text-muted-foreground">
                      {enrollment?.student.father_job || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Education</p>
                    <p className="text-sm text-muted-foreground">
                      {enrollment?.student.father_education || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Mother</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm font-medium">Name</p>
                    <p className="text-sm text-muted-foreground">
                      {enrollment?.student.mother_name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Occupation</p>
                    <p className="text-sm text-muted-foreground">
                      {enrollment?.student.mother_job || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Education</p>
                    <p className="text-sm text-muted-foreground">
                      {enrollment?.student.mother_education || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>

              {!enrollment?.student.father_name &&
                !enrollment?.student.mother_name && (
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
                                ? "success"
                                : tuition.status === "Partial"
                                ? "warning"
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
