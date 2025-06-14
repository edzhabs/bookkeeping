import { Badge } from "@/components/ui/badge";
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
import {
  useOtherPaymentsByIdQuery,
  useTuitionPaymentsByIdQuery,
} from "@/hooks/usePaymentsByIdQuery";
import { IPaymentsID } from "@/types/payment";
import { formatCategory, formatToCurrency } from "@/utils";
import { CreditCard, GraduationCap, Receipt } from "lucide-react";

interface Props {
  enrollmentID: string | undefined;
}

const PaymentRecordsComp = ({ enrollmentID }: Props) => {
  const tuitionPaymentsQuery = useTuitionPaymentsByIdQuery(enrollmentID);
  const otherPaymentsQuery = useOtherPaymentsByIdQuery(enrollmentID);
  const tuitionPayments = tuitionPaymentsQuery.data?.data;
  const otherPayments = otherPaymentsQuery.data?.data;

  const totalPayments = (data: IPaymentsID[] | undefined) => {
    if (!data) return;
    const res = data.reduce((total, item) => {
      return total + parseFloat(item.amount);
    }, 0);
    return res;
  };

  const totalPaid = totalPayments(tuitionPayments) || 0;
  const totalOtherPayments = totalPayments(otherPayments) || 0;

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
                      {formatToCurrency(totalPaid + totalOtherPayments)}
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
                      {formatToCurrency(totalPaid)}
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
                      {formatToCurrency(totalOtherPayments)}
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
                Tuition Payments ({tuitionPayments?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="other-payments">
                Other Payments ({otherPayments?.length || 0})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tuition-payments" className="mt-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">
                    Payments History
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 px-4">
                  {!tuitionPayments || tuitionPayments?.length === 0 ? (
                    <div className="text-center py-8 px-6">
                      <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">
                        No tuition payments recorded yet.
                      </p>
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
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tuitionPayments?.map((payment) => (
                            <TableRow
                              key={payment.id}
                              className="hover:bg-slate-50"
                            >
                              <TableCell className="font-medium">
                                {payment.invoice_number}
                              </TableCell>
                              <TableCell>
                                {new Date(
                                  payment.payment_date
                                ).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="font-medium">
                                {formatToCurrency(payment.amount)}
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">
                                <Badge
                                  variant="outline"
                                  className="text-xs capitalize"
                                >
                                  {payment.payment_method}
                                </Badge>
                              </TableCell>
                              <TableCell className="hidden md:table-cell text-muted-foreground max-w-xs truncate">
                                {payment.notes || "-"}
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
                  {!otherPayments || otherPayments?.length === 0 ? (
                    <div className="text-center py-8 px-6">
                      <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">
                        No other payments recorded yet.
                      </p>
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
                            <TableHead className="font-medium hidden md:table-cell">
                              Notes
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {otherPayments?.map((payment) => (
                            <TableRow
                              key={payment.id}
                              className="hover:bg-slate-50"
                            >
                              <TableCell className="font-medium">
                                {payment.invoice_number}
                              </TableCell>
                              <TableCell>
                                {new Date(
                                  payment.payment_date
                                ).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {payment.category
                                    .slice(0, 2)
                                    .map((item, idx) => (
                                      <Badge
                                        key={idx}
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {formatCategory(item)}
                                      </Badge>
                                    ))}
                                  {payment.category.length > 2 && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      +{payment.category.length - 2} more
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="font-medium">
                                {formatToCurrency(payment.amount)}
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">
                                <Badge
                                  variant="outline"
                                  className="text-xs capitalize"
                                >
                                  {payment.payment_method}
                                </Badge>
                              </TableCell>
                              <TableCell className="hidden md:table-cell text-muted-foreground max-w-xs truncate">
                                {payment.notes || "-"}
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
