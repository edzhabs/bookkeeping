import { useState } from "react";
import { LucideSearch } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, MoreHorizontal } from "lucide-react";
import type { Tuition } from "@/types/tuition";
import type { Carpool } from "@/types/carpool";
import type { ActivityLogItem } from "@/types/activity-log";
import type { Payment } from "@/types/payment";
import { useNavigate } from "react-router-dom";

// Sample data for demonstration - in a real app, you'd fetch this from your database
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

// Sample activity logs for transactions
const sampleActivityLogs: ActivityLogItem[] = [
  {
    id: "1",
    action: "Created",
    entityType: "Payment",
    entityId: "p1",
    timestamp: new Date().toISOString(),
    user: "Admin User",
    details: "Created payment TUI-2023-001 for John Doe",
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
    action: "Created",
    entityType: "Payment",
    entityId: "p2",
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    user: "Admin User",
    details: "Created payment TUI-2023-015 for John Doe",
  },
];

// Create a unified transaction type for the transactions page
type Transaction = {
  id: string;
  invoiceNumber: string;
  studentName: string;
  amount: number;
  date: string;
  method: string;
  notes?: string;
  type: "Tuition" | "Carpool";
  parentId: string; // ID of the parent tuition or carpool record
  originalPayment: Payment | any; // Store the original payment object
  parentRecord: Tuition | Carpool; // Store the parent record
};

export default function TransactionsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"All" | "Tuition" | "Carpool">(
    "All"
  );
  const [activeTab, setActiveTab] = useState<"transactions" | "activity">(
    "transactions"
  );

  // Combine all payments into a unified transactions list
  const allTransactions: Transaction[] = [
    ...initialTuitions.flatMap((tuition) =>
      tuition.payments.map((payment) => ({
        id: payment.id,
        invoiceNumber: payment.invoiceNumber,
        studentName: tuition.studentName,
        amount: payment.amount,
        date: payment.date,
        method: payment.method,
        notes: payment.notes,
        type: "Tuition" as const,
        parentId: tuition.id,
        originalPayment: payment,
        parentRecord: tuition,
      }))
    ),
    ...initialCarpools.flatMap((carpool) =>
      (carpool.payments || []).map((payment) => ({
        id: payment.id,
        invoiceNumber: payment.invoiceNumber,
        studentName: carpool.studentName,
        amount: payment.amount,
        date: payment.date,
        method: payment.method,
        notes: payment.notes,
        type: "Carpool" as const,
        parentId: carpool.id,
        originalPayment: payment,
        parentRecord: carpool,
      }))
    ),
  ];

  // Filter transactions based on search term and filter type
  const filteredTransactions = allTransactions.filter((transaction) => {
    const matchesSearch =
      transaction.invoiceNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.studentName.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterType === "All") {
      return matchesSearch;
    } else {
      return matchesSearch && transaction.type === filterType;
    }
  });

  // Sort transactions by date (newest first)
  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Filter activity logs for transactions
  const filteredActivityLogs = sampleActivityLogs.filter((log) => {
    if (searchTerm === "") return true;

    // Find the related transaction
    const relatedTransaction = allTransactions.find(
      (t) => t.id === log.entityId
    );
    if (!relatedTransaction) return false;

    return (
      relatedTransaction.invoiceNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      relatedTransaction.studentName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleViewTransaction = (transactionId: string) => {
    navigate(`/transactions/${transactionId}`);
  };

  return (
    <div className="container py-8 w-full max-w-full px-4 md:px-6 lg:px-8">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold">Transactions</h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>
            View and manage all payment transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Input
              type="text"
              placeholder="Search by invoice number or student name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:max-w-xs"
              icon={<LucideSearch className="h-4 w-4" />}
            />
            <Select
              value={filterType}
              onValueChange={(value) =>
                setFilterType(value as "All" | "Tuition" | "Carpool")
              }
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Transactions</SelectItem>
                <SelectItem value="Tuition">Tuition Payments</SelectItem>
                <SelectItem value="Carpool">Carpool Payments</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as "transactions" | "activity")
            }
          >
            <TabsList className="mb-4">
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="activity">Activity Log</TabsTrigger>
            </TabsList>

            <TabsContent value="transactions">
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Method
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No transactions found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      sortedTransactions.map((transaction) => (
                        <TableRow key={`${transaction.type}-${transaction.id}`}>
                          <TableCell className="font-medium">
                            {transaction.invoiceNumber}
                          </TableCell>
                          <TableCell>{transaction.studentName}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                transaction.type === "Tuition"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {transaction.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(transaction.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            ₱{transaction.amount.toLocaleString()}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {transaction.method}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleViewTransaction(transaction.id)
                                  }
                                >
                                  <FileText className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="activity">
              <div className="rounded-md border overflow-x-auto">
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
                    {filteredActivityLogs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          No activity logs found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredActivityLogs.map((log) => (
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
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
