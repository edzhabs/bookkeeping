import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StudentEnrollmentDetails } from "@/types/enrollment";
import { formatToCurrency } from "@/utils";
import { CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FinancialSummaryComp = ({
  enrollment,
}: {
  enrollment: StudentEnrollmentDetails;
}) => {
  const navigate = useNavigate();

  const handleMakePayment = (tuitionId: string) => {
    navigate(`/tuitions/${tuitionId}/payment`);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-slate-800">
          Tuition Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">Total Amount</p>
            <p className="text-2xl font-bold text-slate-800">
              {formatToCurrency(enrollment.total_tuition_amount_due)}
            </p>
            <p className="text-xs text-muted-foreground">
              {Number(enrollment?.discount_total_amount) > 0 ? (
                <>
                  {enrollment.discount_types.length || 0} discount
                  {enrollment.discount_types.length > 0 ? "s" : ""} applied
                </>
              ) : (
                "No discount applied"
              )}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Total Paid</p>
            <p className="text-2xl font-bold text-emerald-600">
              {formatToCurrency(enrollment.total_tuition_paid)}
            </p>
            <p className="text-xs text-muted-foreground">
              {1} payment(s) recorded
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Remaining Balance</p>
            <p className="text-2xl font-bold text-amber-600">
              {formatToCurrency(enrollment.tuition_balance)}
            </p>
          </div>
          <Separator />
          <div>
            <p className="text-sm font-medium">Payment Status</p>
            <div className="mt-1">
              {enrollment.tuition_payment_status === "paid" && (
                <Badge variant="success" className="text-sm">
                  Fully Paid
                </Badge>
              )}
              {enrollment.tuition_payment_status === "partial" && (
                <Badge variant="warning" className="text-sm">
                  Partial Payment
                </Badge>
              )}
              {enrollment.tuition_payment_status === "unpaid" && (
                <Badge variant="destructive" className="text-sm">
                  Unpaid
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      {Number(enrollment.tuition_balance) > 0 && (
        <CardFooter className="mt-4">
          <Button
            className="w-full cursor-pointer"
            onClick={() => handleMakePayment("test")}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Make Payment
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default FinancialSummaryComp;
