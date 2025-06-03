import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, GraduationCap, Plus, Receipt } from "lucide-react";
import { Link } from "react-router-dom";

const tuitionPayments = [
  {
    id: "tp1",
    studentId: "1",
    tuitionFeeAmount: 15000,
    paymentMethod: "Bank",
    invoiceNumber: "TUI-2023-001",
    paymentDate: "2023-07-10",
    notes: "First semester payment",
    createdAt: "2023-07-10T10:00:00Z",
    updatedAt: "2023-07-10T10:00:00Z",
  },
  {
    id: "tp2",
    studentId: "1",
    tuitionFeeAmount: 10000,
    paymentMethod: "Cash",
    invoiceNumber: "TUI-2023-015",
    paymentDate: "2023-11-05",
    notes: "Second installment",
    createdAt: "2023-11-05T14:00:00Z",
    updatedAt: "2023-11-05T14:00:00Z",
  },
];

const otherPayments = [
  {
    id: "op1",
    studentId: "1",
    items: [
      { category: "Books", amount: 3500 },
      { category: "PTA", amount: 1000 },
    ],
    totalAmount: 4500,
    paymentMethod: "G-Cash",
    invoiceNumber: "MISC-2023-001",
    paymentDate: "2023-08-15",
    notes: "Books and PTA fee",
    createdAt: "2023-08-15T09:00:00Z",
    updatedAt: "2023-08-15T09:00:00Z",
  },
  {
    id: "op2",
    studentId: "1",
    items: [
      { category: "P.E Shirt", amount: 800 },
      { category: "P.E Pants", amount: 1200 },
    ],
    totalAmount: 2000,
    paymentMethod: "Cash",
    invoiceNumber: "MISC-2023-008",
    paymentDate: "2023-09-20",
    notes: "P.E uniform",
    createdAt: "2023-09-20T11:00:00Z",
    updatedAt: "2023-09-20T11:00:00Z",
  },
  {
    id: "op3",
    studentId: "1",
    items: [{ category: "Carpool", amount: 2000 }],
    totalAmount: 2000,
    paymentMethod: "Bank",
    invoiceNumber: "MISC-2023-012",
    paymentDate: "2023-10-01",
    notes: "Monthly carpool fee",
    createdAt: "2023-10-01T08:00:00Z",
    updatedAt: "2023-10-01T08:00:00Z",
  },
];

interface Props {
  enrollmentID: string | undefined;
}

const PaymentRecordsComp = ({ enrollmentID }: Props) => {
  const totalPaid = 34000;
  const totalOtherPayments = 8000;

  return (
    <TabsContent value="payments" className="space-y-4 pt-4">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-semibold">
                Payment Records
              </CardTitle>
              <CardDescription className="mt-1">
                Complete payment history including tuition and other payments
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-6 mb-6">
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">
                      Total Payments
                    </p>
                    <p className="text-2xl font-bold text-blue-900">
                      ₱{(totalPaid + totalOtherPayments).toLocaleString()}
                    </p>
                  </div>
                  <Receipt className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-emerald-700">
                      Tuition Payments
                    </p>
                    <p className="text-2xl font-bold text-emerald-900">
                      ₱{totalPaid.toLocaleString()}
                    </p>
                  </div>
                  <GraduationCap className="h-8 w-8 text-emerald-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-700">
                      Other Payments
                    </p>
                    <p className="text-2xl font-bold text-purple-900">
                      ₱{totalOtherPayments.toLocaleString()}
                    </p>
                  </div>
                  <CreditCard className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment History Tabs */}
          <Tabs defaultValue="tuition-payments" className="w-full px-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tuition-payments">
                Tuition Payments (0)
              </TabsTrigger>
              <TabsTrigger value="other-payments">
                Other Payments (0)
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tuition-payments" className="mt-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">
                    Tuition Payment History
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 px-4">
                  {tuitionPayments.length === 0 ? (
                    <div className="text-center py-8 px-6">
                      <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">
                        No tuition payments recorded yet.
                      </p>
                      <Link
                        to={`/payments/tuition/new?enrollmentID=${enrollmentID}`}
                      >
                        <Button variant="outline" size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Record First Payment
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="max-h-80 overflow-y-auto">
                      <Table>
                        <TableHeader className="sticky top-0 bg-white border-b">
                          <TableRow>
                            <TableHead className="font-medium">
                              Invoice #
                            </TableHead>
                            <TableHead className="font-medium">Date</TableHead>
                            <TableHead className="font-medium">
                              Amount
                            </TableHead>
                            <TableHead className="font-medium hidden sm:table-cell">
                              Method
                            </TableHead>
                            <TableHead className="font-medium hidden md:table-cell">
                              Notes
                            </TableHead>
                            <TableHead className="text-right font-medium">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tuitionPayments.map((payment) => (
                            <TableRow
                              key={payment.id}
                              className="hover:bg-slate-50"
                            >
                              <TableCell className="font-medium">
                                {payment.invoiceNumber}
                              </TableCell>
                              <TableCell>
                                {new Date(
                                  payment.paymentDate
                                ).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="font-medium">
                                ₱{payment.tuitionFeeAmount.toLocaleString()}
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">
                                <Badge variant="outline" className="text-xs">
                                  {payment.paymentMethod}
                                </Badge>
                              </TableCell>
                              <TableCell className="hidden md:table-cell text-muted-foreground max-w-xs truncate">
                                {payment.notes || "-"}
                              </TableCell>
                              <TableCell className="text-right">
                                <Link to={`/payments/tuition/${payment.id}`}>
                                  <Button variant="ghost" size="sm">
                                    View
                                  </Button>
                                </Link>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="other-payments" className="mt-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">
                    Other Payment History
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 px-4">
                  {otherPayments.length === 0 ? (
                    <div className="text-center py-8 px-6">
                      <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">
                        No other payments recorded yet.
                      </p>
                      <Link
                        to={`/payments/other/new?enrollmentID=${enrollmentID}`}
                      >
                        <Button variant="outline" size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Record First Payment
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="max-h-80 overflow-y-auto">
                      <Table>
                        <TableHeader className="sticky top-0 bg-white border-b">
                          <TableRow>
                            <TableHead className="font-medium">
                              Invoice #
                            </TableHead>
                            <TableHead className="font-medium">Date</TableHead>
                            <TableHead className="font-medium">
                              Categories
                            </TableHead>
                            <TableHead className="font-medium">
                              Amount
                            </TableHead>
                            <TableHead className="font-medium hidden sm:table-cell">
                              Method
                            </TableHead>
                            <TableHead className="text-right font-medium">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {otherPayments.map((payment) => (
                            <TableRow
                              key={payment.id}
                              className="hover:bg-slate-50"
                            >
                              <TableCell className="font-medium">
                                {payment.invoiceNumber}
                              </TableCell>
                              <TableCell>
                                {new Date(
                                  payment.paymentDate
                                ).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {payment.items
                                    .slice(0, 2)
                                    .map((item, idx) => (
                                      <Badge
                                        key={idx}
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {item.category}
                                      </Badge>
                                    ))}
                                  {payment.items.length > 2 && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      +{payment.items.length - 2} more
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="font-medium">
                                ₱{payment.totalAmount.toLocaleString()}
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">
                                <Badge variant="outline" className="text-xs">
                                  {payment.paymentMethod}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Link to={`/payments/other/${payment.id}`}>
                                  <Button variant="ghost" size="sm">
                                    View
                                  </Button>
                                </Link>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default PaymentRecordsComp;
