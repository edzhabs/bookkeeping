"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, LucideDollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaymentForm } from "@/components/payment-form";
import type { Tuition } from "@/types/tuition";
import type { ActivityLogItem } from "@/types/activity-log";
import { logActivity } from "@/lib/activity-logger";
import { useNavigate, useParams } from "react-router-dom";

// Sample data for demonstration
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
  {
    id: "3",
    studentId: "3",
    studentName: "Michael Johnson",
    gradeLevel: "Grade 9",
    discount: "None",
    discountAmount: 0,
    schoolYear: "2023-2024",
    totalAmount: 45000,
    remainingBalance: 25000,
    dueDate: "2023-09-15",
    status: "Partial",
    payments: [
      {
        id: "p3",
        invoiceNumber: "TUI-2023-008",
        amount: 20000,
        date: "2023-09-05",
        method: "Cash",
        notes: "Initial payment",
        reservationFee: 5000,
        tuitionFee: 15000,
        advancePayment: 0,
      },
    ],
  },
];

// Sample activity logs
const sampleActivityLogs: ActivityLogItem[] = [
  {
    id: "1",
    action: "Created",
    entityType: "Tuition",
    entityId: "1",
    timestamp: new Date().toISOString(),
    user: "Admin User",
    details: "Tuition record was created",
  },
  {
    id: "2",
    action: "Updated",
    entityType: "Tuition",
    entityId: "1",
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    user: "Admin User",
    details: "Payment status updated to Partial",
  },
];

export default function TuitionDetailsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const [tuition, setTuition] = useState<Tuition | null>(null);
  const [isPaymentFormOpen, setIsPaymentFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch the tuition data from your API
    const fetchedTuition = initialTuitions.find((t) => t.id === params.id);
    setTuition(fetchedTuition || null);
    setIsLoading(false);

    if (fetchedTuition) {
      logActivity({
        action: "Viewed",
        entityType: "Tuition",
        entityId: fetchedTuition.id,
        details: `Viewed tuition record for ${fetchedTuition.studentName}`,
      });
    }
  }, [params.id]);

  const handlePayment = (
    tuitionId: string,
    paymentData: {
      reservationFee: number;
      tuitionFee: number;
      advancePayment: number;
      method: string;
      invoiceNumber: string;
      date: string;
      notes: string;
    }
  ) => {
    if (!tuition) return;

    const totalAmount =
      paymentData.reservationFee +
      paymentData.tuitionFee +
      paymentData.advancePayment;

    const newPayment = {
      id: `p${Date.now()}`,
      invoiceNumber: paymentData.invoiceNumber,
      amount: totalAmount,
      date: paymentData.date,
      method: paymentData.method,
      notes: paymentData.notes,
      reservationFee: paymentData.reservationFee,
      tuitionFee: paymentData.tuitionFee,
      advancePayment: paymentData.advancePayment,
    };

    const newRemainingBalance = Math.max(
      0,
      tuition.remainingBalance - totalAmount
    );
    const newStatus =
      newRemainingBalance === 0
        ? "Paid"
        : newRemainingBalance < tuition.totalAmount
        ? "Partial"
        : "Unpaid";

    const updatedTuition = {
      ...tuition,
      status: newStatus,
      remainingBalance: newRemainingBalance,
      payments: [...(tuition.payments || []), newPayment],
    };

    setTuition(updatedTuition);

    logActivity({
      action: "Updated",
      entityType: "Tuition",
      entityId: tuitionId,
      details: `Payment of ₱${totalAmount} made via ${paymentData.method}. Invoice #${paymentData.invoiceNumber} generated. Status updated to ${newStatus}.`,
    });

    setIsPaymentFormOpen(false);
  };

  const handleViewTransaction = (paymentId: string) => {
    navigate(`/transactions/${paymentId}`);
  };

  const handleViewStudent = () => {
    if (tuition) {
      navigate(`/enrollment/${tuition.studentId}`);
    }
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

  if (!tuition) {
    return (
      <div className="container py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Tuition Not Found</h1>
        </div>
        <p>The requested tuition record could not be found.</p>
      </div>
    );
  }

  // Filter activity logs for this tuition
  const tuitionLogs = sampleActivityLogs.filter(
    (log) => log.entityId === tuition.id
  );

  return (
    <div className="container py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Tuition Details</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Student</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              <button
                onClick={handleViewStudent}
                className="hover:underline text-left"
              >
                {tuition.studentName}
              </button>
            </p>
            <p className="text-sm text-muted-foreground">
              {tuition.gradeLevel}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ₱{tuition.totalAmount.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              School Year: {tuition.schoolYear}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge
                className="text-base px-3 py-1"
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
              {tuition.status !== "Paid" && (
                <Button size="sm" onClick={() => setIsPaymentFormOpen(true)}>
                  <LucideDollarSign className="mr-2 h-4 w-4" />
                  Pay
                </Button>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Remaining: ₱{tuition.remainingBalance.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Tuition Information</TabsTrigger>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Tuition Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium">Student Name</p>
                <p className="text-sm text-muted-foreground">
                  {tuition.studentName}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Grade Level</p>
                <p className="text-sm text-muted-foreground">
                  {tuition.gradeLevel}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Discount</p>
                <p className="text-sm text-muted-foreground">
                  {tuition.discount}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Discount Amount</p>
                <p className="text-sm text-muted-foreground">
                  ₱{tuition.discountAmount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">School Year</p>
                <p className="text-sm text-muted-foreground">
                  {tuition.schoolYear}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Total Amount</p>
                <p className="text-sm text-muted-foreground">
                  ₱{tuition.totalAmount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Remaining Balance</p>
                <p className="text-sm text-muted-foreground">
                  ₱{tuition.remainingBalance.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Due Date</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(tuition.dueDate).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              {tuition.payments && tuition.payments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Notes
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tuition.payments.map((payment) => (
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
                        <TableCell className="hidden md:table-cell">
                          {payment.notes || "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewTransaction(payment.id)}
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
                  No payment records found.
                </p>
              )}
            </CardContent>
          </Card>
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
                  {tuitionLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        No activity logs found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    tuitionLogs.map((log) => (
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

      {isPaymentFormOpen && (
        <PaymentForm
          isOpen={isPaymentFormOpen}
          onClose={() => setIsPaymentFormOpen(false)}
          tuition={tuition}
          onSubmit={handlePayment}
        />
      )}
    </div>
  );
}
