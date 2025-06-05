import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Receipt, User, Plus, Trash2, Calendar } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

import type { Student } from "@/types/student";

// Sample students data
const sampleStudents: Student[] = [
  {
    id: "1",
    firstName: "John",
    middleName: "Robert",
    lastName: "Doe",
    suffix: "",
    gender: "Male",
    birthdate: "2010-05-15",
    schoolYear: "2023-2024",
    address: "123 Main St, Anytown, USA",
    livingWith: "Both Parents",
    contactNumbers: ["555-123-4567"],
    status: "returning",
    discount: "Sibling Discount",
    discountPercentage: 5,
    gradeLevel: "Grade 10",
    parents: {
      father: {
        fullName: "Robert Doe",
        job: "Engineer",
        educationAttainment: "Bachelor's Degree",
      },
      mother: {
        fullName: "Jane Doe",
        job: "Doctor",
        educationAttainment: "Doctorate",
      },
    },
  },
  {
    id: "2",
    firstName: "Emma",
    middleName: "Grace",
    lastName: "Smith",
    suffix: "",
    gender: "Female",
    birthdate: "2011-08-22",
    schoolYear: "2023-2024",
    address: "456 Oak Ave, Somewhere, USA",
    livingWith: "Mother",
    contactNumbers: ["555-222-3333"],
    status: "new",
    discount: "None",
    discountPercentage: 0,
    gradeLevel: "Grade 8",
    parents: {
      mother: {
        fullName: "Sarah Smith",
        job: "Teacher",
        educationAttainment: "Master's Degree",
      },
    },
  },
];

// Sample enrollment data for different school years
const sampleEnrollments = {
  "1": [
    { schoolYear: "2023-2024", gradeLevel: "Grade 10" },
    { schoolYear: "2022-2023", gradeLevel: "Grade 9" },
  ],
  "2": [{ schoolYear: "2023-2024", gradeLevel: "Grade 8" }],
};

const paymentItemSchema = z
  .object({
    category: z.enum(
      [
        "PTA",
        "Misc Fee",
        "Books",
        "P.E Shirt",
        "P.E Pants",
        "Car Pool",
        "Others",
      ],
      {
        required_error: "Please select a category.",
      }
    ),
    amount: z.coerce
      .number()
      .min(1, { message: "Amount must be greater than 0." }),
    remarks: z.string().optional(),
  })
  .refine(
    (data) => {
      if (
        data.category === "Others" &&
        (!data.remarks || data.remarks.trim() === "")
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Remarks are required when category is 'Others'.",
      path: ["remarks"],
    }
  );

const formSchema = z.object({
  studentId: z.string().min(1, { message: "Please select a student." }),
  schoolYear: z.string().min(1, { message: "Please select a school year." }),
  gradeLevel: z.string().min(1, { message: "Please select a grade level." }),
  items: z
    .array(paymentItemSchema)
    .min(1, { message: "At least one payment item is required." }),
  paymentMethod: z.enum(["Cash", "G-Cash", "Bank"], {
    required_error: "Please select a payment method.",
  }),
  orNumber: z.string().min(1, { message: "O.R number is required." }),
  paymentDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Please enter a valid date.",
  }),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function OtherPaymentPage() {
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const { toast } = useToast();

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [availableEnrollments, setAvailableEnrollments] = useState<
    Array<{ schoolYear: string; gradeLevel: string }>
  >([]);
  const [isPreloaded, setIsPreloaded] = useState(false);

  // Generate unique O.R number
  const generateORNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 900000) + 100000;
    return `MISC-${year}-${random}`;
  };

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentId: "",
      schoolYear: "",
      gradeLevel: "",
      items: [{ category: "PTA", amount: 0, remarks: "" }],
      paymentMethod: "Cash",
      orNumber: generateORNumber(),
      paymentDate: new Date().toISOString().split("T")[0],
      notes: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Check if student is preloaded from URL params
  useEffect(() => {
    const studentId = searchParams.get("studentId");
    const schoolYear = searchParams.get("schoolYear");
    const gradeLevel = searchParams.get("gradeLevel");

    if (studentId) {
      const student = sampleStudents.find((s) => s.id === studentId);
      if (student) {
        setSelectedStudent(student);
        setIsPreloaded(true);

        // Set form values
        form.setValue("studentId", student.id);
        if (schoolYear) form.setValue("schoolYear", schoolYear);
        if (gradeLevel) form.setValue("gradeLevel", gradeLevel);

        // Load enrollments for this student
        const enrollments =
          sampleEnrollments[student.id as keyof typeof sampleEnrollments] || [];
        setAvailableEnrollments(enrollments);
      }
    }
  }, [searchParams, form]);

  // Handle student selection
  const handleStudentChange = (studentId: string) => {
    const student = sampleStudents.find((s) => s.id === studentId);
    if (student) {
      setSelectedStudent(student);
      form.setValue("studentId", studentId);

      // Load enrollments for this student
      const enrollments =
        sampleEnrollments[studentId as keyof typeof sampleEnrollments] || [];
      setAvailableEnrollments(enrollments);

      // Reset school year and grade level
      form.setValue("schoolYear", "");
      form.setValue("gradeLevel", "");
    }
  };

  // Handle school year change
  const handleSchoolYearChange = (schoolYear: string) => {
    form.setValue("schoolYear", schoolYear);

    // Find the grade level for this school year
    const enrollment = availableEnrollments.find(
      (e) => e.schoolYear === schoolYear
    );
    if (enrollment) {
      form.setValue("gradeLevel", enrollment.gradeLevel);
    }
  };

  // Calculate total amount
  const totalAmount = form
    .watch("items")
    .reduce((sum, item) => sum + (item.amount || 0), 0);

  const onSubmit = async (data: FormData) => {
    showLoading("Processing other payment...");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Other Payment Data:", data);

      toast({
        title: "Payment Recorded",
        description: `Other payment of ₱${totalAmount.toLocaleString()} has been successfully recorded.`,
      });

      // Redirect back to student details or payments list
      if (isPreloaded && selectedStudent) {
        navigate(`/enrollment/${selectedStudent.id}`);
      } else {
        navigate("/payments");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      toast({
        title: "Error",
        description: "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      hideLoading();
    }
  };

  return (
    <div className="container py-4 sm:py-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
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
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-4 w-4 text-slate-500" />
                  <h3 className="text-lg font-medium">Student Information</h3>
                </div>

                <FormField
                  control={form.control}
                  name="studentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student</FormLabel>
                      <FormControl>
                        {isPreloaded ? (
                          <Input
                            value={
                              selectedStudent
                                ? `${selectedStudent.lastName}, ${
                                    selectedStudent.firstName
                                  } ${selectedStudent.middleName || ""}`
                                : ""
                            }
                            disabled
                            className="bg-slate-50"
                          />
                        ) : (
                          <StudentCombobox
                            students={sampleStudents}
                            selectedValue={field.value}
                            onValueChange={handleStudentChange}
                            placeholder="Search and select a student..."
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedStudent && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="schoolYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>School Year</FormLabel>
                          <Select
                            onValueChange={handleSchoolYearChange}
                            value={field.value}
                            disabled={isPreloaded}
                          >
                            <FormControl>
                              <SelectTrigger
                                className={isPreloaded ? "bg-slate-50" : ""}
                              >
                                <SelectValue placeholder="Select school year" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {availableEnrollments.map((enrollment) => (
                                <SelectItem
                                  key={enrollment.schoolYear}
                                  value={enrollment.schoolYear}
                                >
                                  {enrollment.schoolYear}
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
                      name="gradeLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Grade Level</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled
                              className="bg-slate-50"
                              placeholder="Grade level will auto-populate"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
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
                      append({ category: "PTA", amount: 0, remarks: "" })
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
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="PTA">PTA</SelectItem>
                                  <SelectItem value="Misc Fee">
                                    Misc Fee
                                  </SelectItem>
                                  <SelectItem value="Books">Books</SelectItem>
                                  <SelectItem value="P.E Shirt">
                                    P.E Shirt
                                  </SelectItem>
                                  <SelectItem value="P.E Pants">
                                    P.E Pants
                                  </SelectItem>
                                  <SelectItem value="Car Pool">
                                    Car Pool
                                  </SelectItem>
                                  <SelectItem value="Others">Others</SelectItem>
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

                      {form.watch(`items.${index}.category`) === "Others" && (
                        <div className="mt-4">
                          <FormField
                            control={form.control}
                            name={`items.${index}.remarks`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Remarks (Required for Others)
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
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Method</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Cash">Cash</SelectItem>
                            <SelectItem value="G-Cash">G-Cash</SelectItem>
                            <SelectItem value="Bank">Bank Transfer</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="orNumber"
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
                    name="paymentDate"
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
                            <span className="text-slate-600">
                              {item.category === "Others"
                                ? item.remarks
                                : item.category}
                              :
                            </span>
                            <span>₱{item.amount.toLocaleString()}</span>
                          </div>
                        )
                    )}
                    <Separator className="my-2" />
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total Amount:</span>
                      <span className="text-xl font-bold">
                        ₱{totalAmount.toLocaleString()}
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
                  onClick={() => router.back()}
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
