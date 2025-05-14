import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { logActivity } from "@/lib/activity-logger";
import type { Student } from "@/types/student";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AlertDescription, AlertTitle } from "@/components/ui/alert";

const studentFormSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters." }),
  middleName: z.string().optional(),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters." }),
  gender: z.enum(["Male", "Female", "Other"]),
  birthdate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Please enter a valid date.",
  }),
  schoolYear: z
    .string()
    .min(4, { message: "Please enter a valid school year." }),
  suffix: z.string().optional(),
  livingWith: z.string().optional(),
  gradeLevel: z.string().min(1, { message: "Grade level is required." }),
  fatherName: z.string().optional(),
  fatherJob: z.string().optional(),
  fatherEducation: z.string().optional(),
  motherName: z.string().optional(),
  motherJob: z.string().optional(),
  motherEducation: z.string().optional(),
});

const feesFormSchema = z.object({
  enrollmentFee: z.coerce.number().min(0),
  tuitionFeeMonthly: z.coerce.number().min(0),
  miscFee: z.coerce.number().min(0),
  ptaFee: z.coerce.number().min(0),
  quipperFee: z.coerce.number().min(0),
  isRankOne: z.boolean().default(false),
  hasSiblingDiscount: z.boolean().default(false),
  hasWholeYearDiscount: z.boolean().default(false),
});

const tuitionFormSchema = z.object({
  baseTuition: z.coerce
    .number()
    .positive({ message: "Amount must be greater than 0." })
    .refine((val) => val > 0, { message: "Amount must be greater than 0." }),
});

export default function NewEnrollmentPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("student");
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [discountLabel, setDiscountLabel] = useState("None");

  // Fee structure
  const [enrollmentFee, setEnrollmentFee] = useState(3000);
  const [tuitionFeeMonthly, setTuitionFeeMonthly] = useState(2600);
  const [miscFee, setMiscFee] = useState(5000);
  const [ptaFee, setPtaFee] = useState(500);
  const [quipperFee, setQuipperFee] = useState(2000);
  const [totalTuitionFee, setTotalTuitionFee] = useState(26000); // 10 months
  const [grandTotal, setGrandTotal] = useState(0);

  const studentForm = useForm<z.infer<typeof studentFormSchema>>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      gender: "Male",
      birthdate: "",
      schoolYear:
        new Date().getFullYear() + "-" + (new Date().getFullYear() + 1),
      suffix: "",
      livingWith: "Both Parents",
      gradeLevel: "Grade 1",
      fatherName: "",
      fatherJob: "",
      fatherEducation: "",
      motherName: "",
      motherJob: "",
      motherEducation: "",
    },
  });

  const feesForm = useForm<z.infer<typeof feesFormSchema>>({
    resolver: zodResolver(feesFormSchema),
    defaultValues: {
      enrollmentFee: 3000,
      tuitionFeeMonthly: 2600,
      miscFee: 5000,
      ptaFee: 500,
      quipperFee: 2000,
      isRankOne: false,
      hasSiblingDiscount: false,
      hasWholeYearDiscount: false,
    },
  });

  const tuitionForm = useForm<z.infer<typeof tuitionFormSchema>>({
    resolver: zodResolver(tuitionFormSchema),
    defaultValues: {
      baseTuition: 50000,
    },
  });

  // Calculate fees and discounts when values change
  useEffect(() => {
    const values = feesForm.getValues();
    const monthlyTuition = values.tuitionFeeMonthly;
    const totalTuition = monthlyTuition * 10;
    setTotalTuitionFee(totalTuition);

    let discountAmt = 0;
    const discountDescription = [];

    // Calculate Rank One discount (free Quipper)
    if (values.isRankOne) {
      discountAmt += values.quipperFee;
      discountDescription.push("Rank One (Free Quipper)");
    }

    // Calculate Sibling discount (5% of tuition)
    if (values.hasSiblingDiscount) {
      const siblingDiscountAmount = totalTuition * 0.05;
      discountAmt += siblingDiscountAmount;
      discountDescription.push("Sibling Discount (5%)");
    }

    // Calculate Whole Year discount (one month free)
    if (values.hasWholeYearDiscount) {
      const wholeYearDiscountAmount = monthlyTuition;
      discountAmt += wholeYearDiscountAmount;
      discountDescription.push("Whole Year Payment (1 month free)");
    }

    // Set discount percentage (approximate for display)
    const totalBeforeDiscount =
      values.enrollmentFee +
      totalTuition +
      values.miscFee +
      values.ptaFee +
      values.quipperFee;
    const discountPct = Math.round((discountAmt / totalBeforeDiscount) * 100);

    setDiscountAmount(discountAmt);
    setDiscountPercentage(discountPct);

    // Calculate grand total
    const total =
      values.enrollmentFee +
      totalTuition +
      values.miscFee +
      values.ptaFee +
      (values.isRankOne ? 0 : values.quipperFee) -
      (values.hasSiblingDiscount ? totalTuition * 0.05 : 0) -
      (values.hasWholeYearDiscount ? monthlyTuition : 0);

    setGrandTotal(total);
    setTotalAmount(total);

    // Update student discount description
    if (discountDescription.length > 0) {
      setDiscountLabel(discountDescription.join(" + "));
    } else {
      setDiscountLabel("None");
    }
  }, [
    feesForm.watch("enrollmentFee"),
    feesForm.watch("tuitionFeeMonthly"),
    feesForm.watch("miscFee"),
    feesForm.watch("ptaFee"),
    feesForm.watch("quipperFee"),
    feesForm.watch("isRankOne"),
    feesForm.watch("hasSiblingDiscount"),
    feesForm.watch("hasWholeYearDiscount"),
  ]);

  const handleStudentSubmit = (values: z.infer<typeof studentFormSchema>) => {
    // Create student object
    const student: Student = {
      id: Date.now().toString(),
      firstName: values.firstName,
      middleName: values.middleName || "",
      lastName: values.lastName,
      gender: values.gender,
      birthdate: values.birthdate,
      schoolYear: values.schoolYear,
      suffix: values.suffix || "",
      livingWith: values.livingWith || "",
      discount: "None", // Will be updated in fees tab
      discountPercentage: 0, // Will be updated in fees tab
      gradeLevel: values.gradeLevel,
      parents: {
        ...(values.fatherName
          ? {
              father: {
                fullName: values.fatherName,
                job: values.fatherJob || "",
                educationAttainment: values.fatherEducation || "",
              },
            }
          : {}),
        ...(values.motherName
          ? {
              mother: {
                fullName: values.motherName,
                job: values.motherJob || "",
                educationAttainment: values.motherEducation || "",
              },
            }
          : {}),
      },
    };

    setStudentData(student);
    setActiveTab("fees");

    logActivity({
      action: "Created",
      entityType: "Student",
      entityId: student.id,
      details: `Created student record for ${student.firstName} ${student.lastName}`,
    });
  };

  const handleFeesSubmit = (values: z.infer<typeof feesFormSchema>) => {
    if (!studentData) return;

    // Update student data with discount information
    const updatedStudent = {
      ...studentData,
      discount: discountLabel,
      discountPercentage: discountPercentage,
    };

    setStudentData(updatedStudent);
    setActiveTab("tuition");
  };

  const handleTuitionSubmit = (values: z.infer<typeof tuitionFormSchema>) => {
    if (!studentData) return;

    // Create tuition record
    const tuition = {
      id: `t${Date.now()}`,
      studentId: studentData.id,
      studentName: `${studentData.firstName} ${studentData.lastName}`,
      gradeLevel: studentData.gradeLevel || "Not specified",
      discount: studentData.discount || "None",
      discountAmount: discountAmount,
      schoolYear: studentData.schoolYear,
      totalAmount: totalAmount,
      remainingBalance: totalAmount,
      dueDate: new Date().toISOString().split("T")[0], // Default due date
      status: "Unpaid",
      payments: [],
    };

    logActivity({
      action: "Created",
      entityType: "Tuition",
      entityId: tuition.id,
      details: `Created tuition record for ${studentData.firstName} ${studentData.lastName} for school year ${studentData.schoolYear}`,
    });

    // In a real app, you would save this data to your database
    console.log("Student data:", studentData);
    console.log("Tuition data:", tuition);

    // Redirect to enrollment page
    navigate("/enrollment");
    toast.success(
      <>
        <div className="flex items-center gap-2">
          <AlertTitle className="text-green-600">
            Enrollment Successful
          </AlertTitle>
        </div>
        <AlertDescription className="text-green-700 mt-1">
          Student has been successfully enrolled with tuition record.
        </AlertDescription>
      </>
    );
  };

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">New Enrollment</h1>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="student">Student Information</TabsTrigger>
          <TabsTrigger value="fees" disabled={!studentData}>
            Fees & Discounts
          </TabsTrigger>
          <TabsTrigger value="tuition" disabled={!studentData}>
            Tuition Summary
          </TabsTrigger>
        </TabsList>

        <TabsContent value="student" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...studentForm}>
                <form
                  onSubmit={studentForm.handleSubmit(handleStudentSubmit)}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <FormField
                        control={studentForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name *</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={studentForm.control}
                        name="middleName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Middle Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={studentForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name *</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <FormField
                        control={studentForm.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender *</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl className="w-full">
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={studentForm.control}
                        name="birthdate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Birthdate *</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={studentForm.control}
                        name="gradeLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Grade Level *</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl className="w-full">
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select grade level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Kindergarten">
                                  Kindergarten
                                </SelectItem>
                                <SelectItem value="Grade 1">Grade 1</SelectItem>
                                <SelectItem value="Grade 2">Grade 2</SelectItem>
                                <SelectItem value="Grade 3">Grade 3</SelectItem>
                                <SelectItem value="Grade 4">Grade 4</SelectItem>
                                <SelectItem value="Grade 5">Grade 5</SelectItem>
                                <SelectItem value="Grade 6">Grade 6</SelectItem>
                                <SelectItem value="Grade 7">Grade 7</SelectItem>
                                <SelectItem value="Grade 8">Grade 8</SelectItem>
                                <SelectItem value="Grade 9">Grade 9</SelectItem>
                                <SelectItem value="Grade 10">
                                  Grade 10
                                </SelectItem>
                                <SelectItem value="Grade 11">
                                  Grade 11
                                </SelectItem>
                                <SelectItem value="Grade 12">
                                  Grade 12
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <FormField
                        control={studentForm.control}
                        name="schoolYear"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>School Year *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., 2023-2024" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={studentForm.control}
                        name="suffix"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Suffix</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., Jr., III" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={studentForm.control}
                        name="livingWith"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Living With</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl className="w-full">
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select option" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Both Parents">
                                  Both Parents
                                </SelectItem>
                                <SelectItem value="Father">Father</SelectItem>
                                <SelectItem value="Mother">Mother</SelectItem>
                                <SelectItem value="Guardian">
                                  Guardian
                                </SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      Father's Information
                    </h3>
                    <div className="grid gap-4 md:grid-cols-3">
                      <FormField
                        control={studentForm.control}
                        name="fatherName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={studentForm.control}
                        name="fatherJob"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Occupation</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={studentForm.control}
                        name="fatherEducation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Education</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="e.g., Bachelor's Degree"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      Mother's Information
                    </h3>
                    <div className="grid gap-4 md:grid-cols-3">
                      <FormField
                        control={studentForm.control}
                        name="motherName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={studentForm.control}
                        name="motherJob"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Occupation</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={studentForm.control}
                        name="motherEducation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Education</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="e.g., Master's Degree"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit">Continue to Fees & Discounts</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fees" className="space-y-6">
          {studentData && (
            <Card>
              <CardHeader>
                <CardTitle>
                  Fees & Discounts for {studentData.firstName}{" "}
                  {studentData.lastName}
                </CardTitle>
              </CardHeader>
              <CardContent>
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
                          name="enrollmentFee"
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
                          name="tuitionFeeMonthly"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Monthly Tuition Fee</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                              <p className="text-xs text-muted-foreground">
                                Total for 10 months: ₱
                                {(field.value * 10).toLocaleString()}
                              </p>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={feesForm.control}
                          name="miscFee"
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
                          name="ptaFee"
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
                          name="quipperFee"
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
                                          feesForm.setValue(
                                            "hasWholeYearDiscount",
                                            false
                                          );
                                        }
                                      }}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>Sibling Discount</FormLabel>
                                    <p className="text-sm text-muted-foreground">
                                      5% off tuition fee for one sibling when 2+
                                      siblings are enrolled
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
                                          feesForm.setValue(
                                            "hasSiblingDiscount",
                                            false
                                          );
                                        }
                                      }}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>Whole Year Payment</FormLabel>
                                    <p className="text-sm text-muted-foreground">
                                      One month free tuition when paying for the
                                      whole year
                                    </p>
                                  </div>
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        <div className="bg-muted p-6 rounded-md space-y-4 mt-6">
                          <h3 className="text-lg font-medium">Fee Breakdown</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <p className="text-sm">Enrollment Fee:</p>
                              <p className="text-sm font-medium">
                                ₱
                                {feesForm
                                  .watch("enrollmentFee")
                                  .toLocaleString()}
                              </p>
                            </div>
                            <div className="flex justify-between">
                              <p className="text-sm">
                                Tuition Fee (10 months):
                              </p>
                              <p className="text-sm font-medium">
                                ₱
                                {(
                                  feesForm.watch("tuitionFeeMonthly") * 10
                                ).toLocaleString()}
                              </p>
                            </div>
                            <div className="flex justify-between">
                              <p className="text-sm">Miscellaneous Fee:</p>
                              <p className="text-sm font-medium">
                                ₱{feesForm.watch("miscFee").toLocaleString()}
                              </p>
                            </div>
                            <div className="flex justify-between">
                              <p className="text-sm">PTA Fee:</p>
                              <p className="text-sm font-medium">
                                ₱{feesForm.watch("ptaFee").toLocaleString()}
                              </p>
                            </div>
                            <div className="flex justify-between">
                              <p className="text-sm">Quipper LMS and Books:</p>
                              <p className="text-sm font-medium">
                                {feesForm.watch("isRankOne") ? (
                                  <span className="line-through">
                                    ₱
                                    {feesForm
                                      .watch("quipperFee")
                                      .toLocaleString()}
                                  </span>
                                ) : (
                                  `₱${feesForm
                                    .watch("quipperFee")
                                    .toLocaleString()}`
                                )}
                              </p>
                            </div>
                            <div className="flex justify-between">
                              <p className="text-sm">Discount:</p>
                              <p className="text-sm font-medium">
                                - ₱{discountAmount.toLocaleString()}
                              </p>
                            </div>
                            <div className="border-t pt-2 flex justify-between">
                              <p className="text-sm font-medium">Total Fees:</p>
                              <p className="text-sm font-bold">
                                ₱{grandTotal.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setActiveTab("student")}
                      >
                        Back to Student Information
                      </Button>
                      <Button type="submit">Continue to Tuition Summary</Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="tuition" className="space-y-6">
          {studentData && (
            <Card>
              <CardHeader>
                <CardTitle>
                  Tuition Summary for {studentData.firstName}{" "}
                  {studentData.lastName}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...tuitionForm}>
                  <form
                    onSubmit={tuitionForm.handleSubmit(handleTuitionSubmit)}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="grid gap-4">
                          <div>
                            <p className="text-sm font-medium">Student:</p>
                            <p className="text-sm text-muted-foreground">
                              {studentData.firstName} {studentData.lastName}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Grade Level:</p>
                            <p className="text-sm text-muted-foreground">
                              {studentData.gradeLevel || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Discount:</p>
                            <p className="text-sm text-muted-foreground">
                              {studentData.discount || "None"} (
                              {discountPercentage}%)
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">School Year:</p>
                            <p className="text-sm text-muted-foreground">
                              {studentData.schoolYear}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-muted p-6 rounded-md space-y-4">
                        <h3 className="text-lg font-medium">
                          Tuition Breakdown
                        </h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <p className="text-sm">Enrollment Fee:</p>
                            <p className="text-sm font-medium">
                              ₱
                              {feesForm
                                .getValues()
                                .enrollmentFee.toLocaleString()}
                            </p>
                          </div>
                          <div className="flex justify-between">
                            <p className="text-sm">Tuition Fee (10 months):</p>
                            <p className="text-sm font-medium">
                              ₱{totalTuitionFee.toLocaleString()}
                            </p>
                          </div>
                          <div className="flex justify-between">
                            <p className="text-sm">Miscellaneous Fee:</p>
                            <p className="text-sm font-medium">
                              ₱{feesForm.getValues().miscFee.toLocaleString()}
                            </p>
                          </div>
                          <div className="flex justify-between">
                            <p className="text-sm">PTA Fee:</p>
                            <p className="text-sm font-medium">
                              ₱{feesForm.getValues().ptaFee.toLocaleString()}
                            </p>
                          </div>
                          <div className="flex justify-between">
                            <p className="text-sm">Quipper LMS and Books:</p>
                            <p className="text-sm font-medium">
                              {feesForm.getValues().isRankOne ? (
                                <span className="line-through">
                                  ₱
                                  {feesForm
                                    .getValues()
                                    .quipperFee.toLocaleString()}
                                </span>
                              ) : (
                                `₱${feesForm
                                  .getValues()
                                  .quipperFee.toLocaleString()}`
                              )}
                            </p>
                          </div>
                          <div className="flex justify-between">
                            <p className="text-sm">Discount:</p>
                            <p className="text-sm font-medium">
                              - ₱{discountAmount.toLocaleString()}
                            </p>
                          </div>
                          <div className="border-t pt-2 flex justify-between">
                            <p className="text-sm font-medium">
                              Total Tuition:
                            </p>
                            <p className="text-sm font-bold">
                              ₱{totalAmount.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setActiveTab("fees")}
                      >
                        Back to Fees & Discounts
                      </Button>
                      <Button type="submit">Complete Enrollment</Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
