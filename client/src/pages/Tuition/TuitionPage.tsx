import { useState } from "react";
import { LucideSearch } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TuitionTable } from "@/components/tuition-table";
import { PaymentForm } from "@/components/payment-form";
import type { Tuition } from "@/types/tuition";
import { logActivity } from "@/lib/activity-logger";

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

export default function TuitionsPage() {
  const navigate = useNavigate();
  const [tuitions, setTuitions] = useState<Tuition[]>(initialTuitions);
  const [isPaymentFormOpen, setIsPaymentFormOpen] = useState(false);
  const [selectedTuition, setSelectedTuition] = useState<Tuition | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTuitions = tuitions.filter(
    (tuition) =>
      tuition.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tuition.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tuition.schoolYear.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    setTuitions((prevTuitions) =>
      prevTuitions.map((tuition) => {
        if (tuition.id === tuitionId) {
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

          logActivity({
            action: "Updated",
            entityType: "Tuition",
            entityId: tuitionId,
            details: `Payment of ₱${totalAmount} made via ${paymentData.method}. Invoice #${paymentData.invoiceNumber} generated. Status updated to ${newStatus}.`,
          });

          return updatedTuition;
        }
        return tuition;
      })
    );
    setIsPaymentFormOpen(false);
    setSelectedTuition(null);
  };

  const handleViewTuition = (tuitionId: string) => {
    navigate(`/tuitions/${tuitionId}`);
  };

  const handleViewStudent = (studentId: string) => {
    navigate(`/enrollment/${studentId}`);
  };

  const openPaymentForm = (tuition: Tuition) => {
    setSelectedTuition(tuition);
    setIsPaymentFormOpen(true);
  };

  return (
    <div className="container py-8">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold">Tuition Management</h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Tuition Records</CardTitle>
          <CardDescription>
            View and manage student tuition payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex w-full max-w-sm items-center space-x-2">
            <Input
              type="text"
              placeholder="Search tuitions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
              icon={<LucideSearch className="h-4 w-4" />}
            />
          </div>
          <TuitionTable
            tuitions={filteredTuitions}
            onPayClick={openPaymentForm}
            onViewClick={handleViewTuition}
            onStudentClick={handleViewStudent}
          />
        </CardContent>
      </Card>

      {selectedTuition && (
        <PaymentForm
          isOpen={isPaymentFormOpen}
          onClose={() => {
            setIsPaymentFormOpen(false);
            setSelectedTuition(null);
          }}
          tuition={selectedTuition}
          onSubmit={handlePayment}
        />
      )}
    </div>
  );
}
