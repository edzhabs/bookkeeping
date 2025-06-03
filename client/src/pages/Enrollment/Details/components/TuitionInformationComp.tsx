import TuitionBreakdown from "@/components/tuition-breakdown";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { StudentEnrollmentDetails } from "@/types/enrollment";
import { formatDiscount, formatToCurrency } from "@/utils";
import { Separator } from "@radix-ui/react-separator";

const TuitionInformationComp = ({
  enrollment,
  getStatusColor,
}: {
  enrollment: StudentEnrollmentDetails | undefined;
  getStatusColor: (text: string | undefined) => void;
}) => {
  const discountAmount = (type: string) => {
    const discount = enrollment?.discount_details.find((d) => d.type === type);

    return discount ? Number(discount.amount) : 0;
  };

  return (
    <TabsContent value="tuition" className="space-y-4 pt-4">
      <Card>
        <CardHeader className="mb-3">
          <CardTitle className="text-2xl">Tuition Information</CardTitle>
          <CardDescription>
            Detailed information about this tuition record
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Discount Information</h3>
                <Separator className="my-2" />
                <dl className="space-y-2">
                  {enrollment?.discount_details.map((d) => (
                    <div key={d.type} className="pb-2">
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium text-muted-foreground">
                          Discount Type:
                        </dt>
                        <dd className="text-sm">{formatDiscount(d.type)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium text-muted-foreground">
                          Discount Amount:
                        </dt>
                        <dd className="text-sm">
                          {formatToCurrency(d.amount)}
                        </dd>
                      </div>
                    </div>
                  ))}
                </dl>
              </div>

              <div>
                <h3 className="text-sm font-medium">Payment Information</h3>
                <Separator className="my-2" />
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-muted-foreground">
                      Total Amount:
                    </dt>
                    <dd className="text-sm">
                      {formatToCurrency(
                        enrollment?.total_tuition_amount_due || 0
                      )}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-muted-foreground">
                      Amount Paid:
                    </dt>
                    <dd className="text-sm">
                      {formatToCurrency(enrollment?.total_tuition_paid || 0)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-muted-foreground">
                      Remaining Balance:
                    </dt>
                    <dd className="text-sm">
                      {formatToCurrency(enrollment?.tuition_balance || 0)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-muted-foreground">
                      Status:
                    </dt>
                    <dd className="text-sm">
                      <Badge
                        className={`${getStatusColor(
                          enrollment?.tuition_payment_status
                        )} capitalize`}
                      >
                        {enrollment?.tuition_payment_status}
                      </Badge>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-muted p-6">
                <h3 className="text-lg font-medium">Tuition Breakdown</h3>
                <Separator className="my-2" />
                <TuitionBreakdown
                  enrollment_fee={Number(enrollment?.enrollment_fee)}
                  monthly_tuition={Number(enrollment?.monthly_tuition)}
                  misc_fee={Number(enrollment?.misc_fee)}
                  pta_fee={Number(enrollment?.pta_fee)}
                  lms_books_fee={Number(enrollment?.lms_books_fee)}
                  discountAmount={Number(enrollment?.discount_total_amount)}
                  totalAmount={Number(enrollment?.total_tuition_amount_due)}
                  isRankOne={discountAmount("rank_1") > 0}
                  rankOneDiscountAmount={discountAmount("rank_1")}
                  fullYearDiscountAmount={discountAmount("full_year")}
                  siblingDiscountAmount={discountAmount("sibling")}
                  scholarDiscountAmount={discountAmount("scholar")}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default TuitionInformationComp;
