import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CreditCard, GraduationCap, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
import TuitionPaymentSchema from "@/lib/validation/TuitionPaymentSchema";
import useEnrollmentInfoStore from "@/stores/useEnrollmentInfoStore";
import {
  TuitionDropdown,
  TuitionEnrollmentDetails,
  TuitionPaymentBody,
} from "@/types/tuition";
import { formatToCurrency, getPaymentStatus } from "@/utils";
import { useNavigate } from "react-router-dom";
import { useTuitionPaymentMutation } from "@/hooks/useTuitionPaymentMutation";

type FormData = z.infer<typeof TuitionPaymentSchema>;

export default function TuitionPaymentPage() {
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();

  const { enrollmentInfo, setEnrollmentInfo } = useEnrollmentInfoStore();

  const [selectedStudent, setSelectedStudent] = useState<
    TuitionDropdown | undefined
  >(undefined);
  const [selectedEnrollment, setSelectedEnrollment] =
    useState<TuitionEnrollmentDetails>();
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [availableEnrollments, setAvailableEnrollments] =
    useState<TuitionEnrollmentDetails[]>();

  const { data, isLoading } = useTuitionDropdownQuery();
  const tuitions = data?.data;

  // Check if this is for a specific tuition that's already paid
  const [tuitionStatus, setTuitionStatus] = useState<string | null>(null);
  const [tuitionSummary, setTuitionSummary] = useState<{
    total_due: number;
    total_paid: number;
    balance: number;
  } | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(TuitionPaymentSchema),
    defaultValues: {
      student_id: "",
      school_year: "",
      grade_level: "",
      amount: 0,
      payment_method: undefined,
      invoice_number: "",
      payment_date: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (isLoading) {
      showLoading();
    } else {
      hideLoading();
    }
  }, [showLoading, hideLoading, isLoading]);

  // Check if student is preloaded from URL params
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

  useEffect(() => {
    if (selectedEnrollment) {
      const total_due = selectedEnrollment.total_due;
      const total_paid = selectedEnrollment.total_paid;
      const balance = selectedEnrollment.balance;

      setTuitionStatus(getPaymentStatus(total_due, total_paid));
      setTuitionSummary({
        total_due: Number(total_due),
        total_paid: Number(total_paid),
        balance: Number(balance),
      });
    }
  }, [selectedEnrollment]);

  const handleStudentChange = (student_id: string) => {
    setSelectedEnrollment(undefined);
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

    const selectedEnrollment = availableEnrollments?.find(
      (e) => e.school_year === school_year
    );

    if (selectedEnrollment) {
      setSelectedEnrollment(selectedEnrollment);
      form.setValue("grade_level", selectedEnrollment.grade_level);
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

  const mutate = useTuitionPaymentMutation();

  const onSubmit = async (data: FormData) => {
    if (!selectedEnrollment || !data) return;
    const body: TuitionPaymentBody = {
      enrollment_id: selectedEnrollment?.enrollment_id,
      amount: data.amount,
      invoice_number: data.invoice_number,
      payment_method: data.payment_method,
      payment_date: data.payment_date,
      notes: data.notes || "",
    };

    mutate.mutate(body);
  };

  return (
    <div className="container py-4 sm:py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
            Tuition Payment
          </h1>
          <p className="text-slate-500">Record a new tuition fee payment</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Information
          </CardTitle>
          <CardDescription>
            {isPreloaded
              ? "Complete the payment details below"
              : "Select a student and enter payment details"}
          </CardDescription>
        </CardHeader>
        {tuitionStatus === "Paid" && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-green-800 font-medium">
                This tuition has been fully paid. No additional payment is
                required.
              </p>
            </div>
          </div>
        )}

        {selectedEnrollment && (
          <div className="mb-3 mt-3 py-3 bg-muted">
            <CardContent>
              <h3 className="text-lg font-medium mb-3">Payment Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-slate-500">Total Tuition</p>
                  <p className="text-xl font-bold text-slate-800">
                    {formatToCurrency(tuitionSummary?.total_due || 0)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-slate-500">Amount Paid</p>
                  <p className="text-xl font-bold text-emerald-600">
                    {formatToCurrency(tuitionSummary?.total_paid || 0)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-slate-500">Remaining Balance</p>
                  <p className="text-xl font-bold text-amber-600">
                    {formatToCurrency(tuitionSummary?.balance || 0)}
                  </p>
                </div>
              </div>

              {selectedEnrollment && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">
                      Payment Progress:
                    </span>
                    <span className="text-sm font-medium">
                      {Math.round(
                        ((tuitionSummary?.total_paid || 0) /
                          (tuitionSummary?.total_due || 0)) *
                          100
                      )}
                      %
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          ((tuitionSummary?.total_paid || 0) /
                            (tuitionSummary?.total_due || 0)) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </CardContent>
          </div>
        )}
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

              {/* Payment Details Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <GraduationCap className="h-4 w-4 text-slate-500" />
                  <h3 className="text-lg font-medium">Payment Details</h3>
                </div>

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tuition Fee Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter tuition fee amount"
                          {...field}
                          className="text-lg font-medium"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="g-Cash">G-Cash</SelectItem>
                            <SelectItem value="bank">Bank Transfer</SelectItem>
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
              {form.watch("amount") > 0 && (
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Payment Summary</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Tuition Fee:</span>
                    <span className="text-xl font-bold">
                      ₱{form.watch("amount").toLocaleString()}
                    </span>
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
                  disabled={
                    !selectedStudent ||
                    !form.watch("amount") ||
                    form.watch("amount") <= 0 ||
                    tuitionStatus === "Paid"
                  }
                  className="sm:flex-1"
                >
                  {tuitionStatus === "Paid"
                    ? "Tuition Fully Paid"
                    : "Record Payment"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
