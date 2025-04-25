import { DebouncedInput } from "@/components/DebouncedInput";
import {
  Tuition,
  TuitionColumns,
} from "@/components/Table-Columns/tuition-columns";
import { Button } from "@/components/ui/button";
import { DataTableViewOptions } from "@/components/ui/Table/column-options";
import { DataTable } from "@/components/ui/Table/data-table";
import useStudents from "@/hooks/useStudents";
import useTable from "@/hooks/useTable";
import { PlusCircle, UserPlus, CreditCard } from "lucide-react";
import { useState } from "react";
import TuitionPaymentPage from "./TuitionPaymentPage";
// Mock data for tuition payments
const tuitionPayments = [
  {
    id: "PAY-001",
    studentName: "Juan Dela Cruz",
    gradeLevel: "Grade 10",
    paymentDate: new Date("2023-06-15"),
    amount: 15000,
    paymentType: "Tuition Fee",
    paymentMethod: "Cash",
    invoiceNo: "INV-2023-001",
    status: "Paid",
  },
  {
    id: "PAY-002",
    studentName: "Maria Santos",
    gradeLevel: "Grade 8",
    paymentDate: new Date("2023-06-20"),
    amount: 5000,
    paymentType: "Reservation Fee",
    paymentMethod: "GCash",
    invoiceNo: "INV-2023-002",
    status: "Paid",
  },
  {
    id: "PAY-003",
    studentName: "Pedro Reyes",
    gradeLevel: "Grade 12",
    paymentDate: new Date("2023-07-05"),
    amount: 20000,
    paymentType: "Tuition Fee",
    paymentMethod: "Bank Transfer",
    invoiceNo: "INV-2023-003",
    status: "Paid",
  },
  {
    id: "PAY-004",
    studentName: "Ana Gonzales",
    gradeLevel: "Grade 7",
    paymentDate: new Date("2023-07-10"),
    amount: 10000,
    paymentType: "Advance Payment",
    paymentMethod: "Cash",
    invoiceNo: "INV-2023-004",
    status: "Paid",
  },
  {
    id: "PAY-005",
    studentName: "Jose Rizal",
    gradeLevel: "Grade 11",
    paymentDate: new Date("2023-07-15"),
    amount: 12000,
    paymentType: "Tuition Fee",
    paymentMethod: "GCash",
    invoiceNo: "INV-2023-005",
    status: "Paid",
  },
  {
    id: "PAY-006",
    studentName: "Juan Dela Cruz",
    gradeLevel: "Grade 10",
    paymentDate: new Date("2023-08-01"),
    amount: 8000,
    paymentType: "Advance Payment",
    paymentMethod: "Bank Transfer",
    invoiceNo: "INV-2023-006",
    status: "Paid",
  },
  {
    id: "PAY-007",
    studentName: "Maria Santos",
    gradeLevel: "Grade 8",
    paymentDate: new Date("2023-08-10"),
    amount: 10000,
    paymentType: "Tuition Fee",
    paymentMethod: "Cash",
    invoiceNo: "INV-2023-007",
    status: "Paid",
  },
];
const TuitionPage = () => {
  const { isError, isLoading } = useStudents();
  const { table, setGlobalFilter } = useTable(TuitionColumns, tuitionPayments);
  const [selectedTuition, setSelectedTuition] = useState<Tuition | null>();
  const [showPaymentPage, setShowPaymentPage] = useState(false);
  if (showPaymentPage) return <TuitionPaymentPage />;
  console.log(selectedTuition);
  return (
    <div className="container mx-auto py-2">
      <div className="flex flex-wrap gap-2 w-full pb-4 sm:w-auto">
        <Button
          asChild
          className="flex-1 sm:flex-none cursor-pointer"
          onClick={() => setShowPaymentPage(true)}
        >
          <span>
            <CreditCard className="mr-2 h-4 w-4" />
            Pay Tuition
          </span>
        </Button>
        <Button
          asChild
          variant="outline"
          className="flex-1 sm:flex-none cursor-pointer"
        >
          <span>
            <PlusCircle className="mr-2 h-4 w-4" />
            Enroll New Student
          </span>
        </Button>
        <Button
          asChild
          variant="outline"
          className="flex-1 sm:flex-none cursor-pointer"
        >
          <span>
            <UserPlus className="mr-2 h-4 w-4" />
            Enroll Existing Student
          </span>
        </Button>
      </div>
      <div className="flex items-center pb-2">
        <DebouncedInput
          value={table.getState().globalFilter || ""}
          placeholder="search.."
          onChange={(value) => setGlobalFilter(value)}
          className="w-1/4"
        />
        {/* Visibility */}
        <DataTableViewOptions table={table} />
      </div>

      <DataTable
        table={table}
        columns={TuitionColumns}
        setSelected={setSelectedTuition}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
};

export default TuitionPage;
