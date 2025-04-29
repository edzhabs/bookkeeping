"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
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
import { DeleteConfirmation } from "@/components/delete-confirmation";
import { EditTransactionForm } from "@/components/edit-transaction-form";
import { RemarksModal } from "@/components/remarks-modal";
import type { Tuition, Payment } from "@/types/tuition";
import type { Carpool } from "@/types/carpool";
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
];

const initialCarpools: Carpool[] = [
  {
    id: "1",
    studentId: "1",
    studentName: "John Doe",
    route: "North Route",
    driver: "Michael Brown",
    fee: 2000,
    status: "Active",
    paymentStatus: "Paid",
    payments: [
      {
        id: "cp1",
        invoiceNumber: "CAR-2023-001",
        amount: 2000,
        date: "2023-09-10",
        method: "Cash",
        notes: "Monthly payment",
      },
    ],
  },
];

// Sample activity logs for a specific transaction
const sampleTransactionLogs: ActivityLogItem[] = [
  {
    id: "1",
    action: "Created",
    entityType: "Payment",
    entityId: "p1",
    timestamp: new Date().toISOString(),
    user: "Admin User",
    details: "Created payment record",
  },
  {
    id: "2",
    action: "Updated",
    entityType: "Payment",
    entityId: "p1",
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    user: "Admin User",
    details: "Updated payment method from Cash to Bank Transfer",
  },
  {
    id: "3",
    action: "Viewed",
    entityType: "Payment",
    entityId: "p1",
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    user: "Admin User",
    details: "Viewed payment details",
  },
];

// Create a unified transaction type
type Transaction = {
  id: string;
  invoiceNumber: string;
  studentName: string;
  amount: number;
  date: string;
  method: string;
  notes?: string;
  type: "Tuition" | "Carpool";
  parentId: string;
  originalPayment: Payment | any;
  parentRecord: Tuition | Carpool;
};

export default function TransactionDetailsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isRemarksModalOpen, setIsRemarksModalOpen] = useState(false);
  const [actionType, setActionType] = useState<"delete" | "edit" | null>(null);

  useEffect(() => {
    // In a real app, you would fetch the transaction data from your API
    // Here we're searching through our sample data
    let foundTransaction: Transaction | null = null;

    // Search in tuition payments
    for (const tuition of initialTuitions) {
      const payment = tuition.payments.find((p) => p.id === params.id);
      if (payment) {
        foundTransaction = {
          id: payment.id,
          invoiceNumber: payment.invoiceNumber,
          studentName: tuition.studentName,
          amount: payment.amount,
          date: payment.date,
          method: payment.method,
          notes: payment.notes,
          type: "Tuition",
          parentId: tuition.id,
          originalPayment: payment,
          parentRecord: tuition,
        };
        break;
      }
    }

    // If not found in tuition payments, search in carpool payments
    if (!foundTransaction) {
      for (const carpool of initialCarpools) {
        const payment = carpool.payments?.find((p) => p.id === params.id);
        if (payment) {
          foundTransaction = {
            id: payment.id,
            invoiceNumber: payment.invoiceNumber,
            studentName: carpool.studentName,
            amount: payment.amount,
            date: payment.date,
            method: payment.method,
            notes: payment.notes,
            type: "Carpool",
            parentId: carpool.id,
            originalPayment: payment,
            parentRecord: carpool,
          };
          break;
        }
      }
    }

    setTransaction(foundTransaction);
    setIsLoading(false);

    if (foundTransaction) {
      logActivity({
        action: "Viewed",
        entityType: "Transaction",
        entityId: foundTransaction.id,
        details: `Viewed transaction ${foundTransaction.invoiceNumber}`,
      });
    }
  }, [params.id]);

  // Update the handleEditClick function to directly open the edit form
  const handleEditClick = () => {
    setIsEditOpen(true);
  };

  const handleUpdateTransaction = (transactionId: string, updatedData: any) => {
    if (!transaction) return;

    // In a real app, you would update the transaction in your database
    console.log(`Updating transaction: ${transactionId}`, updatedData);
    console.log(`Update remarks: ${updatedData.remarks}`);

    // Update the local state to reflect changes
    setTransaction({
      ...transaction,
      invoiceNumber: updatedData.invoiceNumber,
      date: updatedData.date,
      method: updatedData.method,
      notes: updatedData.notes,
      amount: updatedData.amount || transaction.amount,
      originalPayment: {
        ...transaction.originalPayment,
        invoiceNumber: updatedData.invoiceNumber,
        date: updatedData.date,
        method: updatedData.method,
        notes: updatedData.notes,
        ...(transaction.type === "Tuition" && {
          reservationFee: updatedData.reservationFee,
          tuitionFee: updatedData.tuitionFee,
          advancePayment: updatedData.advancePayment,
          amount: updatedData.amount,
        }),
      },
    });

    logActivity({
      action: "Updated",
      entityType:
        transaction.type === "Tuition" ? "Tuition Payment" : "Carpool Payment",
      entityId: transaction.id,
      details: `Updated ${transaction.type.toLowerCase()} payment ${
        transaction.invoiceNumber
      } for ${transaction.studentName}. Reason: ${updatedData.remarks}`,
    });

    setIsEditOpen(false);
  };

  // Update the handleDeleteClick function to show the delete confirmation first
  const handleDeleteClick = () => {
    setIsDeleteOpen(true);
  };

  // Update the handleDeleteConfirm function to show the remarks modal after confirmation
  const handleDeleteConfirm = () => {
    setIsDeleteOpen(false);
    setActionType("delete");
    setIsRemarksModalOpen(true);
  };

  // Update the handleDeleteWithRemarks function to handle the final deletion
  const handleDeleteWithRemarks = (remarks: string) => {
    if (!transaction) return;

    // In a real app, you would soft delete the transaction in your database
    console.log(`Soft deleting transaction: ${transaction.invoiceNumber}`);
    console.log(`Delete remarks: ${remarks}`);

    logActivity({
      action: "Deleted",
      entityType:
        transaction.type === "Tuition" ? "Tuition Payment" : "Carpool Payment",
      entityId: transaction.id,
      details: `Deleted ${transaction.type.toLowerCase()} payment ${
        transaction.invoiceNumber
      } for ${transaction.studentName}. Reason: ${remarks}`,
    });

    setIsRemarksModalOpen(false);
    navigate("/transactions");
  };

  const handleViewStudent = () => {
    if (transaction) {
      const studentId = (transaction.parentRecord as any).studentId;
      navigate(`/enrollment/${studentId}`);
    }
  };

  const handleViewParentRecord = () => {
    if (transaction) {
      if (transaction.type === "Tuition") {
        navigate(`/tuitions/${transaction.parentId}`);
      } else {
        navigate(`/carpool/${transaction.parentId}`);
      }
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

  if (!transaction) {
    return (
      <div className="container py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Transaction Not Found</h1>
        </div>
        <p>The requested transaction could not be found.</p>
      </div>
    );
  }

  const isTuition = transaction.type === "Tuition";
  const tuitionPayment = isTuition
    ? (transaction.originalPayment as Payment)
    : null;

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Transaction Details</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleEditClick}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDeleteClick}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Invoice Number
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{transaction.invoiceNumber}</p>
            <div className="flex items-center mt-1">
              <Badge variant={isTuition ? "default" : "secondary"}>
                {transaction.type}
              </Badge>
            </div>
          </CardContent>
        </Card>
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
                {transaction.studentName}
              </button>
            </p>
            <p className="text-sm text-muted-foreground">
              <button
                onClick={handleViewParentRecord}
                className="hover:underline text-left"
              >
                View {transaction.type} Record
              </button>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ₱{transaction.amount.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              {new Date(transaction.date).toLocaleDateString()} •{" "}
              {transaction.method}
            </p>
          </CardContent>
        </Card>
      </div>
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">Transaction Details</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6 pt-4">
          {isTuition && tuitionPayment && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="text-sm">Reservation Fee:</p>
                    <p className="text-sm font-medium">
                      ₱{tuitionPayment.reservationFee.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm">Tuition Fee:</p>
                    <p className="text-sm font-medium">
                      ₱{tuitionPayment.tuitionFee.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm">Advance Payment:</p>
                    <p className="text-sm font-medium">
                      ₱{tuitionPayment.advancePayment.toLocaleString()}
                    </p>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <p className="text-sm font-medium">Total:</p>
                    <p className="text-sm font-bold">
                      ₱{tuitionPayment.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Transaction Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium">Invoice Number</p>
                <p className="text-sm text-muted-foreground">
                  {transaction.invoiceNumber}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Type</p>
                <p className="text-sm text-muted-foreground">
                  {transaction.type}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Student</p>
                <p className="text-sm text-muted-foreground">
                  {transaction.studentName}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Date</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(transaction.date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Amount</p>
                <p className="text-sm text-muted-foreground">
                  ₱{transaction.amount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Payment Method</p>
                <p className="text-sm text-muted-foreground">
                  {transaction.method}
                </p>
              </div>
              {transaction.notes && (
                <div className="col-span-2">
                  <p className="text-sm font-medium">Notes</p>
                  <p className="text-sm text-muted-foreground">
                    {transaction.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Related {transaction.type} Record</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {isTuition ? (
                <>
                  <div>
                    <p className="text-sm font-medium">School Year</p>
                    <p className="text-sm text-muted-foreground">
                      {(transaction.parentRecord as Tuition).schoolYear}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Grade Level</p>
                    <p className="text-sm text-muted-foreground">
                      {(transaction.parentRecord as Tuition).gradeLevel}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Total Tuition</p>
                    <p className="text-sm text-muted-foreground">
                      ₱
                      {(
                        transaction.parentRecord as Tuition
                      ).totalAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Remaining Balance</p>
                    <p className="text-sm text-muted-foreground">
                      ₱
                      {(
                        transaction.parentRecord as Tuition
                      ).remainingBalance.toLocaleString()}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm font-medium">Route</p>
                    <p className="text-sm text-muted-foreground">
                      {(transaction.parentRecord as Carpool).route}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Driver</p>
                    <p className="text-sm text-muted-foreground">
                      {(transaction.parentRecord as Carpool).driver}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Fee</p>
                    <p className="text-sm text-muted-foreground">
                      ₱
                      {(
                        transaction.parentRecord as Carpool
                      ).fee.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Status</p>
                    <p className="text-sm text-muted-foreground">
                      {(transaction.parentRecord as Carpool).status}
                    </p>
                  </div>
                </>
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
                  {sampleTransactionLogs.map((log) => (
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
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      // Update the DeleteConfirmation component in the JSX
      <DeleteConfirmation
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Transaction"
        description={`Are you sure you want to delete transaction ${transaction?.invoiceNumber}?`}
      />
      {transaction && (
        <EditTransactionForm
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          transaction={transaction}
          onSubmit={handleUpdateTransaction}
        />
      )}
      // Update the RemarksModal component in the JSX
      <RemarksModal
        isOpen={isRemarksModalOpen}
        onClose={() => setIsRemarksModalOpen(false)}
        onConfirm={handleDeleteWithRemarks}
        title="Provide Deletion Reason"
        description={`Please provide a reason for deleting transaction ${transaction?.invoiceNumber}.`}
        actionLabel="Delete Transaction"
        actionVariant="destructive"
      />
    </div>
  );
}
