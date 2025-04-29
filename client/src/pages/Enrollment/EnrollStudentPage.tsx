import { useState, useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
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
  discount: z.string().optional(),
  gradeLevel: z.string().min(1, { message: "Grade level is required." }),
  fatherName: z.string().optional(),
  fatherJob: z.string().optional(),
  fatherEducation: z.string().optional(),
  motherName: z.string().optional(),
  motherJob: z.string().optional(),
  motherEducation: z.string().optional(),
});

const tuitionFormSchema = z.object({
  baseTuition: z.coerce
    .number()
    .positive({ message: "Amount must be greater than 0." })
    .refine((val) => val > 0, { message: "Amount must be greater than 0." }),
});

export default function EnrollStudentPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("student");
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [discountPercentage, setDiscountPercentage] = useState(0);

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
      discount: "None",
      gradeLevel: "Grade 1",
      fatherName: "",
      fatherJob: "",
      fatherEducation: "",
      motherName: "",
      motherJob: "",
      motherEducation: "",
    },
  });

  const tuitionForm = useForm<z.infer<typeof tuitionFormSchema>>({
    resolver: zodResolver(tuitionFormSchema),
    defaultValues: {
      baseTuition: 0,
    },
  });

  /// Handle discount percentage based on selected discount
  const discountType = useWatch({
    control: studentForm.control,
    name: "discount",
  });
  useEffect(() => {
    let percentage = 0;

    switch (discountType) {
      case "Sibling Discount":
        percentage = 10;
        break;
      case "Scholar":
        percentage = 50;
        break;
      case "Employee Discount":
        percentage = 20;
        break;
      default:
        percentage = 0;
    }

    setDiscountPercentage(percentage);
  }, [discountType]);

  // Calculate discount and total amount when base tuition or discount percentage changes
  const currentBaseTuition = useWatch({
    control: tuitionForm.control,
    name: "baseTuition",
  });
  const discountAmount = useMemo(() => {
    return (discountPercentage / 100) * currentBaseTuition;
  }, [discountPercentage, currentBaseTuition]);

  const totalAmount = useMemo(() => {
    return currentBaseTuition - discountAmount;
  }, [currentBaseTuition, discountAmount]);

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
      discount: values.discount || "None",
      discountPercentage: discountPercentage,
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
    setActiveTab("tuition");

    logActivity({
      action: "Created",
      entityType: "Student",
      entityId: student.id,
      details: `Created student record for ${student.firstName} ${student.lastName}`,
    });
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
    console.log(values);

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
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/enrollment")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">New Enrollment</h1>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="student">Student Information</TabsTrigger>
          <TabsTrigger value="tuition" disabled={!studentData}>
            Tuition Setup
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
                    <div className="grid gap-4 md:grid-cols-3 w-full">
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

                    <div className="grid gap-4 md:grid-cols-3 w-full">
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

                    <div className="grid gap-4 md:grid-cols-3 w-full">
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

                    <FormField
                      control={studentForm.control}
                      name="discount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl className="w-full">
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select discount" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="None">None (0%)</SelectItem>
                              <SelectItem value="Sibling Discount">
                                Sibling Discount (10%)
                              </SelectItem>
                              <SelectItem value="Scholar">
                                Scholar (50%)
                              </SelectItem>
                              <SelectItem value="Employee Discount">
                                Employee Discount (20%)
                              </SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      Father's Information
                    </h3>
                    <div className="grid gap-4 md:grid-cols-3 w-full">
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
                    <div className="grid gap-4 md:grid-cols-3 w-full">
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
                    <Button type="submit">Continue to Tuition Setup</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tuition" className="space-y-6">
          {studentData && (
            <Card>
              <CardHeader>
                <CardTitle>
                  Tuition Setup for {studentData.firstName}{" "}
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

                        <FormField
                          control={tuitionForm.control}
                          name="baseTuition"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Base Tuition Amount</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="bg-muted p-6 rounded-md space-y-4">
                        <h3 className="text-lg font-medium">
                          Tuition Breakdown
                        </h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <p className="text-sm">Base Tuition:</p>
                            <p className="text-sm font-medium">
                              ₱{currentBaseTuition.toLocaleString()}
                            </p>
                          </div>
                          <div className="flex justify-between">
                            <p className="text-sm">
                              Discount ({discountPercentage}%):
                            </p>
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
                        onClick={() => setActiveTab("student")}
                      >
                        Back to Student Information
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
