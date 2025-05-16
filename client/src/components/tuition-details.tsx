"use client";

import { useState } from "react";
import { Pencil, Trash2, MoreHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActivityLog } from "@/components/activity-log";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DeleteConfirmation } from "@/components/delete-confirmation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Tuition, Payment } from "@/types/tuition";
import type { ActivityLogItem } from "@/types/activity-log";

interface TuitionDetailsProps {
  tuition: Tuition;
  isOpen: boolean;
  onClose: () => void;
  onEditPayment?: (tuition: Tuition, payment: Payment) => void;
  onDeletePayment?: (tuition: Tuition, paymentId: string) => void;
}

// Sample activity log data
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
  {
    id: "3",
    action: "Updated",
    entityType: "Tuition",
    entityId: "2",
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    user: "Admin User",
    details: "Created tuition record",
  },
];

export function TuitionDetails({
  tuition,
  isOpen,
  onClose,
  onEditPayment,
  onDeletePayment,
}: TuitionDetailsProps) {
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleEditPayment = (payment: Payment) => {
    if (onEditPayment) {
      onEditPayment(tuition, payment);
      onClose();
    }
  };

  const handleDeleteClick = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedPayment && onDeletePayment) {
      onDeletePayment(tuition, selectedPayment.id);
      setIsDeleteOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto sm:max-h-[85vh] p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>Tuition Details</DialogTitle>
          <DialogDescription>
            Detailed information about {tuition.studentName}'s tuition
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Information</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
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
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <Badge
                    variant={
                      tuition.status === "Paid"
                        ? "success"
                        : tuition.status === "Partial"
                        ? "warning"
                        : "destructive"
                    }
                    className="mt-1"
                  >
                    {tuition.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                {tuition.payments && tuition.payments.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Method
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Notes
                        </TableHead>
                        {(onEditPayment || onDeletePayment) && (
                          <TableHead className="text-right">Actions</TableHead>
                        )}
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
                          <TableCell className="hidden sm:table-cell">
                            {payment.method}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {payment.notes || "-"}
                          </TableCell>
                          {(onEditPayment || onDeletePayment) && (
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {onEditPayment && (
                                    <DropdownMenuItem
                                      onClick={() => handleEditPayment(payment)}
                                    >
                                      <Pencil className="mr-2 h-4 w-4" />
                                      Edit Payment
                                    </DropdownMenuItem>
                                  )}
                                  {onDeletePayment && (
                                    <DropdownMenuItem
                                      onClick={() => handleDeleteClick(payment)}
                                      className="text-destructive"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete Payment
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          )}
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
            <ActivityLog
              logs={sampleActivityLogs.filter(
                (log) => log.entityId === tuition.id
              )}
            />
          </TabsContent>
        </Tabs>

        {selectedPayment && onDeletePayment && (
          <DeleteConfirmation
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
            onConfirm={confirmDelete}
            title="Delete Payment"
            description={`Are you sure you want to delete payment ${selectedPayment.invoiceNumber}? This action cannot be undone.`}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
