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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { logActivity } from "@/lib/activity-logger";
import type { Student } from "@/types/student";
import { useNavigate, useParams } from "react-router-dom";

const formSchema = z.object({
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

// Sample data for demonstration
const initialStudents: Student[] = [
  {
    id: "1",
    firstName: "John",
    middleName: "Robert",
    lastName: "Doe",
    gender: "Male",
    birthdate: "2010-05-15",
    schoolYear: "2023-2024",
    suffix: "",
    livingWith: "Both Parents",
    discount: "None",
    discountPercentage: 0,
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
    gender: "Female",
    birthdate: "2011-08-22",
    schoolYear: "2023-2024",
    suffix: "",
    livingWith: "Mother",
    discount: "Sibling Discount",
    discountPercentage: 10,
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

export default function EditStudentDetailsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [student, setStudent] = useState<Student | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      gender: "Male",
      birthdate: "",
      schoolYear: "",
      suffix: "",
      livingWith: "",
      discount: "",
      gradeLevel: "",
      fatherName: "",
      fatherJob: "",
      fatherEducation: "",
      motherName: "",
      motherJob: "",
      motherEducation: "",
    },
  });

  useEffect(() => {
    // In a real app, you would fetch the student data from your API
    const fetchedStudent = initialStudents.find((s) => s.id === params.id);
    setStudent(fetchedStudent || null);
    setIsLoading(false);

    if (fetchedStudent) {
      form.reset({
        firstName: fetchedStudent.firstName,
        middleName: fetchedStudent.middleName || "",
        lastName: fetchedStudent.lastName,
        gender: fetchedStudent.gender as "Male" | "Female" | "Other",
        birthdate: fetchedStudent.birthdate,
        schoolYear: fetchedStudent.schoolYear,
        suffix: fetchedStudent.suffix || "",
        livingWith: fetchedStudent.livingWith || "Both Parents",
        discount: fetchedStudent.discount || "None",
        gradeLevel: fetchedStudent.gradeLevel || "Grade 1",
        fatherName: fetchedStudent.parents.father?.fullName || "",
        fatherJob: fetchedStudent.parents.father?.job || "",
        fatherEducation:
          fetchedStudent.parents.father?.educationAttainment || "",
        motherName: fetchedStudent.parents.mother?.fullName || "",
        motherJob: fetchedStudent.parents.mother?.job || "",
        motherEducation:
          fetchedStudent.parents.mother?.educationAttainment || "",
      });
    }
  }, [params.id, form]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    if (!student) return;

    // In a real app, you would update the student data in your database
    const updatedStudent: Student = {
      ...student,
      firstName: values.firstName,
      middleName: values.middleName || "",
      lastName: values.lastName,
      gender: values.gender,
      birthdate: values.birthdate,
      schoolYear: values.schoolYear,
      suffix: values.suffix || "",
      livingWith: values.livingWith || "",
      discount: values.discount || "None",
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

    console.log("Updated student:", updatedStudent);

    logActivity({
      action: "Updated",
      entityType: "Student",
      entityId: student.id,
      details: `Updated student record for ${student.firstName} ${student.lastName}`,
    });

    // Redirect back to student details page
    navigate(`/enrollment/${student.id}`);
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Loading...</h1>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="container py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Student Not Found</h1>
        </div>
        <p>The requested student record could not be found.</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Edit Student</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Edit {student.firstName} {student.lastName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
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
                    control={form.control}
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
                    control={form.control}
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
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
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
                    control={form.control}
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
                    control={form.control}
                    name="gradeLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grade Level *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
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
                            <SelectItem value="Grade 10">Grade 10</SelectItem>
                            <SelectItem value="Grade 11">Grade 11</SelectItem>
                            <SelectItem value="Grade 12">Grade 12</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
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
                    control={form.control}
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
                    control={form.control}
                    name="livingWith"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Living With</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select option" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Both Parents">
                              Both Parents
                            </SelectItem>
                            <SelectItem value="Father">Father</SelectItem>
                            <SelectItem value="Mother">Mother</SelectItem>
                            <SelectItem value="Guardian">Guardian</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="discount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select discount" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="None">None (0%)</SelectItem>
                          <SelectItem value="Sibling Discount">
                            Sibling Discount (10%)
                          </SelectItem>
                          <SelectItem value="Scholar">Scholar (50%)</SelectItem>
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
                <h3 className="text-lg font-medium">Father's Information</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
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
                    control={form.control}
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
                    control={form.control}
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
                <h3 className="text-lg font-medium">Mother's Information</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
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
                    control={form.control}
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
                    control={form.control}
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

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
