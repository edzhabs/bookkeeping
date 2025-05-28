import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import feesFormSchema from "@/lib/validation/TuitionFeeSchema";
import { EnrollStudent } from "@/types/enrollment";
import TuitionBreakdown from "../tuition-breakdown";

interface TuitionFeeFormProps {
  enrollmentData: EnrollStudent;
  discountAmount: number;
  rankOneDiscountAmount: number;
  siblingDiscountAmount: number;
  fullYearDiscountAmount: number;
  scholarDiscountAmount: number;
  totalAmount: number;
  isEdit: boolean;
  initialData: EnrollStudent | undefined;
  setEnrollmentData: (data: EnrollStudent) => void;
  setActiveTab: (tab: string) => void;
  setDiscountAmount: (amount: number) => void;
  setTotalAmount: (total: number) => void;
  setTotalTuitionFee: (total: number) => void;
  setRankOneDiscountAmount: (amount: number) => void;
  setSiblingDiscountAmount: (amount: number) => void;
  setFullYearDiscountAmount: (amount: number) => void;
  setScholarDiscountAmount: (amount: number) => void;
}

const TuitionFeeForm = ({
  enrollmentData,
  discountAmount,
  rankOneDiscountAmount,
  siblingDiscountAmount,
  fullYearDiscountAmount,
  scholarDiscountAmount,
  totalAmount,
  isEdit,
  initialData,
  setEnrollmentData,
  setActiveTab,
  setDiscountAmount,
  setTotalAmount,
  setTotalTuitionFee,
  setFullYearDiscountAmount,
  setRankOneDiscountAmount,
  setScholarDiscountAmount,
  setSiblingDiscountAmount,
}: TuitionFeeFormProps) => {
  const [discounts, setDiscounts] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const feesForm = useForm<z.infer<typeof feesFormSchema>>({
    resolver: zodResolver(feesFormSchema),
    defaultValues: {
      enrollment_fee: 0,
      monthly_tuition: 0,
      misc_fee: 0,
      pta_fee: 0,
      lms_books_fee: 0,
      isRankOne: false,
      hasSiblingDiscount: false,
      hasWholeYearDiscount: false,
      hasScholarDiscount: false,
    },
  });

  useEffect(() => {
    if (!isEdit || !initialData) return;

    feesForm.reset({
      enrollment_fee: initialData.enrollment_fee,
      monthly_tuition: initialData.monthly_tuition,
      misc_fee: initialData.misc_fee,
      pta_fee: initialData.pta_fee,
      lms_books_fee: initialData.lms_books_fee,
      isRankOne: initialData.isRankOne,
      hasSiblingDiscount: initialData.hasSiblingDiscount,
      hasWholeYearDiscount: initialData.hasWholeYearDiscount,
      hasScholarDiscount: initialData.hasScholarDiscount,
    });

    setIsInitialized(true); // trigger calculation once
  }, [feesForm, isEdit, initialData]);

  useEffect(() => {
    if (!isInitialized) return;
    setIsInitialized(false);

    feesForm.trigger();
  }, [isInitialized, feesForm]);

  useEffect(() => {
    if (!isEdit || !initialData) return;

    const monthlyTuition = Number(initialData.monthly_tuition) || 0;
    const totalTuition = monthlyTuition * 10;
    setTotalTuitionFee(totalTuition);

    let quipperDiscountAmount = 0;
    let siblingDiscountAmount = 0;
    let fullYearDiscountAmount = 0;
    let scholarDiscountAmount = 0;
    const discounts: string[] = [];

    if (initialData.isRankOne) {
      quipperDiscountAmount = Number(initialData.lms_books_fee);
      discounts.push("rank_1");
    }

    if (initialData.hasSiblingDiscount) {
      siblingDiscountAmount = totalTuition * 0.05;
      discounts.push("sibling");
    }

    if (initialData.hasWholeYearDiscount) {
      fullYearDiscountAmount = monthlyTuition;
      discounts.push("full_year");
    }

    if (initialData.hasScholarDiscount) {
      scholarDiscountAmount = totalTuition * 0.5;
      discounts.push("scholar");
    }

    const totalDiscountAmount =
      quipperDiscountAmount +
      siblingDiscountAmount +
      fullYearDiscountAmount +
      scholarDiscountAmount;

    setRankOneDiscountAmount(quipperDiscountAmount);
    setSiblingDiscountAmount(siblingDiscountAmount);
    setFullYearDiscountAmount(fullYearDiscountAmount);
    setScholarDiscountAmount(scholarDiscountAmount);

    setDiscountAmount(totalDiscountAmount);
    setDiscounts(discounts);

    const totalAmount =
      (Number(initialData.enrollment_fee) || 0) +
      totalTuition +
      (Number(initialData.misc_fee) || 0) +
      (Number(initialData.pta_fee) || 0) +
      (Number(initialData.lms_books_fee) || 0) -
      totalDiscountAmount;

    setTotalAmount(totalAmount);
  }, [initialData, isEdit]);

  const watchedValues = useWatch({
    control: feesForm.control,
    name: [
      "enrollment_fee",
      "monthly_tuition",
      "misc_fee",
      "pta_fee",
      "lms_books_fee",
      "isRankOne",
      "hasSiblingDiscount",
      "hasWholeYearDiscount",
      "hasScholarDiscount",
    ],
  });

  useEffect(() => {
    const [
      enrollment_fee,
      monthly_tuition,
      misc_fee,
      pta_fee,
      lms_books_fee,
      isRankOne,
      hasSiblingDiscount,
      hasWholeYearDiscount,
      hasScholarDiscount,
    ] = watchedValues;

    const monthlyTuition = Number(monthly_tuition) || 0;
    const totalTuition = monthlyTuition * 10;
    setTotalTuitionFee(totalTuition);

    let quipperDiscountAmount = 0;
    let siblingDiscountAmount = 0;
    let fullYearDiscountAmount = 0;
    let scholarDiscountAmount = 0;
    const discounts: string[] = [];

    if (isRankOne) {
      quipperDiscountAmount = Number(lms_books_fee);
      discounts.push("rank_1");
    }

    if (hasSiblingDiscount) {
      siblingDiscountAmount = totalTuition * 0.05;
      discounts.push("sibling");
    }

    if (hasWholeYearDiscount) {
      fullYearDiscountAmount = monthlyTuition;
      discounts.push("full_year");
    }

    if (hasScholarDiscount) {
      scholarDiscountAmount = totalTuition * 0.5;
      discounts.push("scholar");
    }

    const totalDiscountAmount =
      quipperDiscountAmount +
      siblingDiscountAmount +
      fullYearDiscountAmount +
      scholarDiscountAmount;

    setRankOneDiscountAmount(quipperDiscountAmount);
    setSiblingDiscountAmount(siblingDiscountAmount);
    setFullYearDiscountAmount(fullYearDiscountAmount);
    setScholarDiscountAmount(scholarDiscountAmount);

    setDiscountAmount(totalDiscountAmount);
    setDiscounts(discounts);

    const totalAmount =
      (Number(enrollment_fee) || 0) +
      totalTuition +
      (Number(misc_fee) || 0) +
      (Number(pta_fee) || 0) +
      (Number(lms_books_fee) || 0) -
      totalDiscountAmount;

    setTotalAmount(totalAmount);
  }, [
    watchedValues,
    setDiscountAmount,
    setTotalAmount,
    setTotalTuitionFee,
    setFullYearDiscountAmount,
    setRankOneDiscountAmount,
    setScholarDiscountAmount,
    setSiblingDiscountAmount,
  ]);

  const handleFeesSubmit = (values: z.infer<typeof feesFormSchema>) => {
    if (!enrollmentData) return;

    const updatedStudent: EnrollStudent = {
      ...enrollmentData,
      discounts: discounts,
      enrollment_fee: values.enrollment_fee,
      monthly_tuition: values.monthly_tuition,
      lms_books_fee: values.lms_books_fee,
      misc_fee: values.misc_fee,
      pta_fee: values.pta_fee,
    };

    console.log(updatedStudent);

    setEnrollmentData(updatedStudent);
    setActiveTab("tuition");
  };

  return (
    <Form {...feesForm}>
      <form
        onSubmit={feesForm.handleSubmit(handleFeesSubmit)}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Fee Structure</h3>

            <FormField
              control={feesForm.control}
              name="enrollment_fee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enrollment Fee</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={feesForm.control}
              name="monthly_tuition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Tuition Fee</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground">
                    Total for 10 months: ₱{(field.value * 10).toLocaleString()}
                  </p>
                </FormItem>
              )}
            />

            <FormField
              control={feesForm.control}
              name="misc_fee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Miscellaneous Fee</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={feesForm.control}
              name="pta_fee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PTA Fee</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={feesForm.control}
              name="lms_books_fee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quipper LMS and Books Fee</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6">
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Discounts</h3>

              <div className="space-y-4">
                <FormField
                  control={feesForm.control}
                  name="isRankOne"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Rank One in Class</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          100% Free Quipper LMS and Books
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                <Separator />
                <FormField
                  control={feesForm.control}
                  name="hasSiblingDiscount"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            // If sibling discount is checked, uncheck whole year discount
                            if (checked) {
                              feesForm.setValue("hasWholeYearDiscount", false);
                              feesForm.setValue("hasScholarDiscount", false);
                            }
                          }}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Sibling Discount</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          5% off tuition fee for one sibling when 2+ siblings
                          are enrolled
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={feesForm.control}
                  name="hasWholeYearDiscount"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            // If whole year discount is checked, uncheck sibling discount
                            if (checked) {
                              feesForm.setValue("hasSiblingDiscount", false);
                              feesForm.setValue("hasScholarDiscount", false);
                            }
                          }}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Whole Year Payment</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          One month free tuition when paying for the whole year
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={feesForm.control}
                  name="hasScholarDiscount"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            // If sibling discount is checked, uncheck whole year discount
                            if (checked) {
                              feesForm.setValue("hasWholeYearDiscount", false);
                              feesForm.setValue("hasSiblingDiscount", false);
                            }
                          }}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Scholar</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          50% off tuition fee
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="bg-muted p-6 rounded-md space-y-4 mt-6">
              <h3 className="text-lg font-medium">Fee Breakdown</h3>
              <TuitionBreakdown
                enrollment_fee={feesForm.watch("enrollment_fee")}
                monthly_tuition={feesForm.watch("monthly_tuition") * 10}
                misc_fee={feesForm.watch("misc_fee")}
                pta_fee={feesForm.watch("pta_fee")}
                lms_books_fee={feesForm.watch("lms_books_fee")}
                isRankOne={feesForm.watch("isRankOne")}
                rankOneDiscountAmount={rankOneDiscountAmount}
                siblingDiscountAmount={siblingDiscountAmount}
                fullYearDiscountAmount={fullYearDiscountAmount}
                scholarDiscountAmount={scholarDiscountAmount}
                discountAmount={discountAmount}
                totalAmount={totalAmount}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            disabled={
              feesForm.formState.isLoading || feesForm.formState.isSubmitting
            }
            onClick={() => setActiveTab("student")}
          >
            Back to Student Information
          </Button>
          <Button type="submit">Continue to Tuition Summary</Button>
        </div>
      </form>
    </Form>
  );
};

export default TuitionFeeForm;
