import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Calendar, Plus, Receipt, Trash2, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import { TuitionStudentCombobox } from "@/components/tuitionStudent-combo-box";
import { useLoading } from "@/context/loading-prover";
import useTuitionDropdownQuery from "@/hooks/useTuitionDropdownQuery";
import useEnrollmentInfoStore from "@/stores/useEnrollmentInfoStore";
import { TuitionDropdown, TuitionEnrollmentDetails } from "@/types/tuition";
import CONSTANTS from "@/constants/constants";
import OtherPaymentSchema from "@/lib/validation/OtherPaymentSchema";
import { formatToCurrency } from "@/utils";
import { OtherPaymentBody } from "@/types/payment";
import { useOtherPaymentMutation } from "@/hooks/useOtherPaymentMutation";

type FormData = z.infer<typeof OtherPaymentSchema>;

export default function OtherPaymentPage() {
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();

  const { enrollmentInfo, setEnrollmentInfo } = useEnrollmentInfoStore();

  const [selectedStudent, setSelectedStudent] = useState<
    TuitionDropdown | undefined
  >(undefined);
  const [availableEnrollments, setAvailableEnrollments] =
    useState<TuitionEnrollmentDetails[]>();
  const [selectedEnrollment, setSelectedEnrollment] =
    useState<TuitionEnrollmentDetails>();

  const [isPreloaded, setIsPreloaded] = useState(false);

  const { data, isLoading } = useTuitionDropdownQuery();
  const tuitions = data?.data;

  const form = useForm<FormData>({
    resolver: zodResolver(OtherPaymentSchema),
    defaultValues: {
      student_id: "",
      school_year: "",
      grade_level: "",
      items: [{ category: undefined, amount: 0, remarks: "" }],
      payment_method: undefined,
      invoice_number: "",
      payment_date: "",
      notes: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  useEffect(() => {
    if (isLoading) {
      showLoading();
    } else {
      hideLoading();
    }
  }, [showLoading, hideLoading, isLoading]);

  // Check if student is preloaded
  useEffect(() => {
    const enrollment_id = enrollmentInfo?.enrollment_id;
    const student_id = enrollmentInfo?.student_id;
    const school_year = enrollmentInfo?.school_year;
    const grade_level = enrollmentInfo?.grade_level;

    if (enrollment_id) {
      setIsPreloaded(true);

      const student = tuitions?.find((t) => t.student_id === student_id);
      const currentEnrollment = student?.tuition_details.find(
        (td) => td.school_year === school_year
      );

      form.setValue("student_id", student_id || "");
      setSelectedStudent(student);
      setSelectedEnrollment(currentEnrollment);

      if (school_year) form.setValue("school_year", school_year);
      if (grade_level) form.setValue("grade_level", grade_level);
    }
  }, [enrollmentInfo, form, tuitions]);

  const handleStudentChange = (student_id: string) => {
    const student = tuitions?.find((s) => s.student_id === student_id);
    if (student) {
      setSelectedStudent(student);
      form.setValue("student_id", student_id);

      setAvailableEnrollments(student.tuition_details);

      form.setValue("school_year", "");
      form.setValue("grade_level", "");
    }
  };

  const handleSchoolYearChange = (school_year: string) => {
    form.setValue("school_year", school_year);

    const currentEnrollment = availableEnrollments?.find(
      (e) => e.school_year === school_year
    );
    setSelectedEnrollment(currentEnrollment);

    if (currentEnrollment) {
      form.setValue("grade_level", currentEnrollment.grade_level);
    }
  };

  const handleBack = () => {
    setEnrollmentInfo(null);
    showLoading();
    if (isPreloaded) {
      navigate(`/enrollment/${enrollmentInfo?.enrollment_id}`);
    } else {
      navigate("/enrollment");
    }
  };

  // Calculate total amount
  const totalAmount = (form.watch("items") ?? []).reduce(
    (sum, item) => Number(sum) + (Number(item.amount) || 0),
    0
  );

  const mutate = useOtherPaymentMutation(totalAmount);

  const onSubmit = async (data: FormData) => {
    if (!selectedEnrollment || !data) return;
    const body: OtherPaymentBody = {
      enrollment_id: selectedEnrollment.enrollment_id,
      invoice_number: data.invoice_number,
      payment_method: data.payment_method,
      payment_date: data.payment_date,
      notes: data.notes || "",
      items: data.items,
    };

    mutate.mutate(body);
  };

  return (
    <div className="container py-4 sm:py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={() => handleBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
            Other Payment
          </h1>
          <p className="text-slate-500">
            Record payments for books, PTA, miscellaneous fees, and more
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Payment Information
          </CardTitle>
          <CardDescription>
            {isPreloaded
              ? "Complete the payment details below"
              : "Select a student and enter payment details"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Student Information Section */}
              <div className="mb-0 mt-3">
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-4 w-4 text-slate-500" />
                  <h3 className="text-lg font-medium">Student Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="student_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Student</FormLabel>
                          <FormControl>
                            <TuitionStudentCombobox
                              isDisabled={isPreloaded}
                              tuitions={tuitions}
                              isLoading={isLoading}
                              selectedValue={field.value}
                              onValueChange={handleStudentChange}
                              placeholder="Search and select a student..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {selectedStudent && (
                    <>
                      <FormField
                        control={form.control}
                        name="school_year"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>School Year</FormLabel>
                            {isPreloaded ? (
                              <Input
                                value={enrollmentInfo?.school_year}
                                disabled
                                className="bg-slate-50 font-medium text-blue-600"
                              />
                            ) : (
                              <Select
                                onValueChange={handleSchoolYearChange}
                                value={field.value}
                                disabled={isPreloaded}
                              >
                                <FormControl>
                                  <SelectTrigger
                                    className={`w-full ${
                                      isPreloaded ? "bg-slate-50" : ""
                                    }`}
                                  >
                                    <SelectValue placeholder="Select school year" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {availableEnrollments?.map((enrollment) => (
                                    <SelectItem
                                      key={enrollment.school_year}
                                      value={enrollment.school_year}
                                    >
                                      {enrollment.school_year}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="grade_level"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Grade Level</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled
                                className="bg-slate-50 capitalize font-bold text-blue-600"
                                placeholder="auto display grade level"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </div>
              </div>
              <Separator />

              {/* Payment Items Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Receipt className="h-4 w-4 text-slate-500" />
                    <h3 className="text-lg font-medium">Payment Items</h3>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      append({
                        category: undefined,
                        amount: 0,
                        remarks: "",
                      })
                    }
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>

                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <Card key={field.id} className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">Item {index + 1}</h4>
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`items.${index}.category`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {CONSTANTS.CATEGORIES.map((category) => (
                                    <SelectItem
                                      key={category.value}
                                      value={category.value}
                                    >
                                      {category.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`items.${index}.amount`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Amount</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Enter amount"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {form.watch(`items.${index}.category`) === "others" && (
                        <div className="mt-4">
                          <FormField
                            control={form.control}
                            name={`items.${index}.remarks`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Remarks* (Required for Others)
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Please specify the payment category"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Payment Details Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <h3 className="text-lg font-medium">Payment Details</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="payment_method"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Method</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CONSTANTS.PAYMENTMETHODS.map((pm) => (
                              <SelectItem key={pm.value} value={pm.value}>
                                {pm.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="invoice_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>O.R Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Official Receipt Number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="payment_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add any additional notes about this payment..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Payment Summary */}
              {totalAmount > 0 && (
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Payment Summary</h4>
                  <div className="space-y-2">
                    {form.watch("items").map(
                      (item, index) =>
                        item.amount > 0 && (
                          <div
                            key={index}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-slate-600 capitalize">
                              {item.category === "others"
                                ? item.remarks
                                : CONSTANTS.CATEGORIES.find(
                                    (c) => c.value === item.category
                                  )?.label}
                              :
                            </span>
                            <span>{formatToCurrency(item.amount)}</span>
                          </div>
                        )
                    )}
                    <Separator className="my-2" />
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total Amount:</span>
                      <span className="text-xl font-bold">
                        {formatToCurrency(totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!selectedStudent || totalAmount <= 0}
                  className="sm:flex-1"
                >
                  Record Payment
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
