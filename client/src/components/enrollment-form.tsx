import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
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
import type { Student } from "@/types/student";

const formSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters." }),
  middleName: z.string().optional(),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters." }),
  suffix: z.string().optional(),
  gender: z.enum(["Male", "Female", "Other"]),
  birthdate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Please enter a valid date.",
  }),
  schoolYear: z
    .string()
    .min(4, { message: "Please enter a valid school year." }),
  gradeLevel: z.string().min(1, { message: "Grade level is required." }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters." }),
  livingWith: z.string().optional(),
  fatherName: z.string().optional(),
  fatherJob: z.string().optional(),
  fatherEducation: z.string().optional(),
  motherName: z.string().optional(),
  motherJob: z.string().optional(),
  motherEducation: z.string().optional(),
});

interface EnrollmentFormProps {
  onSubmit: (student: Student) => boolean;
  student?: Student | null;
}

export function EnrollmentForm({ onSubmit, student }: EnrollmentFormProps) {
  const [activeTab, setActiveTab] = useState("basic");
  const [contactNumbers, setContactNumbers] = useState<string[]>([]);
  const [newContactNumber, setNewContactNumber] = useState("");
  const isEditing = !!student;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      suffix: "",
      gender: "Male",
      birthdate: "",
      schoolYear:
        new Date().getFullYear() + "-" + (new Date().getFullYear() + 1),
      gradeLevel: "",
      address: "",
      livingWith: "Both Parents",
      fatherName: "",
      fatherJob: "",
      fatherEducation: "",
      motherName: "",
      motherJob: "",
      motherEducation: "",
    },
  });

  // Update form when editing a student
  useEffect(() => {
    if (student) {
      form.reset({
        firstName: student.firstName,
        middleName: student.middleName || "",
        lastName: student.lastName,
        suffix: student.suffix || "",
        gender: student.gender as "Male" | "Female" | "Other",
        birthdate: student.birthdate,
        schoolYear: student.schoolYear,
        gradeLevel: student.gradeLevel || "",
        address: student.address,
        livingWith: student.livingWith || "Both Parents",
        fatherName: student.parents.father?.fullName || "",
        fatherJob: student.parents.father?.job || "",
        fatherEducation: student.parents.father?.educationAttainment || "",
        motherName: student.parents.mother?.fullName || "",
        motherJob: student.parents.mother?.job || "",
        motherEducation: student.parents.mother?.educationAttainment || "",
      });
      setContactNumbers(student.contactNumbers || []);
    } else {
      form.reset({
        firstName: "",
        middleName: "",
        lastName: "",
        suffix: "",
        gender: "Male",
        birthdate: "",
        schoolYear:
          new Date().getFullYear() + "-" + (new Date().getFullYear() + 1),
        gradeLevel: "",
        address: "",
        livingWith: "Both Parents",
        fatherName: "",
        fatherJob: "",
        fatherEducation: "",
        motherName: "",
        motherJob: "",
        motherEducation: "",
      });
      setContactNumbers([]);
    }
  }, [student, form]);

  const addContactNumber = () => {
    if (newContactNumber.trim() !== "") {
      setContactNumbers([...contactNumbers, newContactNumber.trim()]);
      setNewContactNumber("");
    }
  };

  const removeContactNumber = (index: number) => {
    setContactNumbers(contactNumbers.filter((_, i) => i !== index));
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const studentData: Student = {
      id: student?.id || "",
      firstName: values.firstName,
      middleName: values.middleName || "",
      lastName: values.lastName,
      suffix: values.suffix || "",
      gender: values.gender,
      birthdate: values.birthdate,
      schoolYear: values.schoolYear,
      gradeLevel: values.gradeLevel || "",
      address: values.address,
      livingWith: values.livingWith || "",
      contactNumbers: contactNumbers,
      discount: student?.discount || "None",
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

    try {
      const success = onSubmit(studentData);
      if (success) {
        form.reset();
        setContactNumbers([]);
      }
    } catch (error) {
      console.error("Error submitting student data:", error);
      // You would typically show a toast notification here
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="additional">Additional Information</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 pt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
              <div className="grid grid-cols-2 gap-2">
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
                <FormField
                  control={form.control}
                  name="suffix"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Suffix</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Jr., III" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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

            <div className="grid gap-4 md:grid-cols-2">
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
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Complete address" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <FormLabel>Contact Numbers</FormLabel>
              <div className="flex flex-wrap gap-2 mb-2">
                {contactNumbers.map((number, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="px-3 py-1.5 flex items-center"
                  >
                    {number}
                    <button
                      type="button"
                      onClick={() => removeContactNumber(index)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                      aria-label="Remove contact number"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {contactNumbers.length === 0 && (
                  <span className="text-sm text-muted-foreground">
                    No contact numbers added
                  </span>
                )}
              </div>
              <div className="flex gap-2 flex-col sm:flex-row">
                <Input
                  value={newContactNumber}
                  onChange={(e) => setNewContactNumber(e.target.value)}
                  placeholder="Add contact number"
                  className="flex-1"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={addContactNumber}
                  className="whitespace-nowrap"
                >
                  <PlusCircle className="h-4 w-4 mr-1" /> Add Number
                </Button>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="button" onClick={() => setActiveTab("additional")}>
                Next
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="additional" className="space-y-4 pt-4">
            <div className="grid gap-4 md:grid-cols-2">
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
                        <Input {...field} placeholder="e.g., Master's Degree" />
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
                onClick={() => setActiveTab("basic")}
              >
                Previous
              </Button>
              <Button type="submit">{isEditing ? "Update" : "Submit"}</Button>
            </div>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
}
