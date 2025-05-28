import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, X } from "lucide-react";
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
import CONSTANTS from "@/constants/constants";
import newEnrollmentSchema from "@/lib/validation/NewStudentEnrollment";
import { EnrollStudent } from "@/types/enrollment";
import { capitalFirstLetter, formatDisplayGradeLevel } from "@/utils";
import { useEffect, useState } from "react";

interface StudentFormProps {
  isEdit: boolean;
  initialData: EnrollStudent | undefined;
  setActiveTab: (tab: string) => void;
  setEnrollmentData: (data: EnrollStudent) => void;
}

type FormValues = z.infer<typeof newEnrollmentSchema>;

const StudentInfoForm = ({
  isEdit,
  initialData,
  setActiveTab,
  setEnrollmentData,
}: StudentFormProps) => {
  const [newContactNumber, setNewContactNumber] = useState("");
  const [contactNumbers, setContactNumbers] = useState<string[]>([]);

  const studentForm = useForm<FormValues>({
    resolver: zodResolver(newEnrollmentSchema),
    defaultValues: {
      first_name: "",
      middle_name: "",
      last_name: "",
      suffix: "",
      gender: undefined,
      birthdate: "",
      address: "",
      school_year: "",
      grade_level: undefined,
      living_with: "",
      contact_numbers: [],
      father_name: "",
      father_job: "",
      father_education: "",
      mother_name: "",
      mother_job: "",
      mother_education: "",
    },
  });

  useEffect(() => {
    if (!isEdit || !initialData?.student) return;

    const gender = capitalFirstLetter(initialData.student.gender || "Male") as
      | "Male"
      | "Female";
    studentForm.reset({
      first_name: initialData.student.first_name,
      middle_name: initialData.student.middle_name,
      last_name: initialData.student.last_name,
      suffix: initialData.student.suffix || "",
      gender: gender,
      birthdate: initialData.student.birthdate
        ? initialData.student.birthdate.slice(0, 10)
        : "",
      address: initialData.student.address,
      contact_numbers: initialData.student.contact_numbers,
      school_year: initialData.school_year,
      grade_level: initialData.grade_level,
      living_with: initialData.student.living_with || "",
      father_name: initialData.student.father_name || "",
      father_job: initialData.student.father_job || "",
      father_education: initialData.student.father_education || "",
      mother_name: initialData.student.mother_name || "",
      mother_job: initialData.student.mother_job || "",
      mother_education: initialData.student.mother_education || "",
    });
    setContactNumbers(initialData.student.contact_numbers || []);
  }, [isEdit, initialData, studentForm]);

  const addContactNumber = () => {
    if (newContactNumber.trim() === "") return;

    const updatedNumbers = [...contactNumbers, newContactNumber.trim()];
    setContactNumbers(updatedNumbers);
    studentForm.setValue("contact_numbers", updatedNumbers);
    setNewContactNumber("");
  };

  const removeContactNumber = (index: number) => {
    const updatedNumbers = contactNumbers.filter((_, i) => i !== index);
    setContactNumbers(updatedNumbers);
    studentForm.setValue("contact_numbers", updatedNumbers);
    studentForm.trigger("contact_numbers");
  };

  const handleStudentSubmit = (values: FormValues) => {
    const enrollment: EnrollStudent = {
      student: {
        first_name: values.first_name,
        middle_name: values.middle_name,
        last_name: values.last_name,
        suffix: values.suffix || "",
        gender: values.gender,
        birthdate: values.birthdate,
        address: values.address,
        living_with: values.living_with || "",
        contact_numbers: values.contact_numbers,
        father_name: values.father_name,
        father_job: values.father_job || "",
        father_education: values.father_education || "",
        mother_name: values.mother_name,
        mother_job: values.mother_job || "",
        mother_education: values.mother_education || "",
      },
      type: "new",
      school_year: values.school_year,
      grade_level: values.grade_level,
      discounts: [],
      enrollment_fee: 0,
      lms_books_fee: 0,
      misc_fee: 0,
      monthly_tuition: 0,
      pta_fee: 0,
    };
    setEnrollmentData(enrollment);
    setActiveTab("fees");
  };

  return (
    <Form {...studentForm}>
      <form onSubmit={studentForm.handleSubmit(handleStudentSubmit)}>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <FormField
              control={studentForm.control}
              name="first_name"
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
              name="middle_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Middle Name *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={studentForm.control}
              name="last_name"
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
              control={studentForm.control}
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

          <div className="grid gap-4 md:grid-cols-4">
            <div className="col-span-1">
              <FormField
                control={studentForm.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender *</FormLabel>
                    {isEdit && field.value && (
                      <Select
                        value={field.value}
                        onValueChange={(val) => field.onChange(val)}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    {!isEdit && (
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
                        </SelectContent>
                      </Select>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={studentForm.control}
                name="birthdate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Birthdate *</FormLabel>
                    <FormControl className="w-full">
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-2">
              <FormField
                control={studentForm.control}
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
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <FormField
              control={studentForm.control}
              name="school_year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School Year *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., 2025-2026" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={studentForm.control}
              name="grade_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grade Level *</FormLabel>
                  {isEdit && field.value && (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl className="w-full">
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select grade level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CONSTANTS.GRADELEVELS.map((grade) => (
                          <SelectItem
                            className="capitalize"
                            key={grade}
                            value={grade}
                          >
                            {formatDisplayGradeLevel(grade)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {!isEdit && (
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
                        {CONSTANTS.GRADELEVELS.map((grade) => (
                          <SelectItem
                            className="capitalize"
                            key={grade}
                            value={grade}
                          >
                            {formatDisplayGradeLevel(grade)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="col-span-2">
              <FormField
                control={studentForm.control}
                name="living_with"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Living With</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., Both Parents, Guardian, etc."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <FormLabel>Contact Numbers</FormLabel>
            <div className="flex flex-wrap gap-2 mb-2">
              {contactNumbers.map((number, index) => {
                const error =
                  studentForm.formState.errors.contact_numbers?.[index];
                return (
                  <Badge
                    key={index}
                    variant="secondary"
                    className={`px-3 py-1.5 flex items-center ${
                      error ? "border border-red-500" : ""
                    }`}
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
                );
              })}
              {contactNumbers.length === 0 && (
                <span className="text-sm text-muted-foreground">
                  No contact numbers added
                </span>
              )}
            </div>
            <div className="flex gap-2 md:w-lg lg:w-1/2 flex-col sm:flex-row">
              <Input
                value={newContactNumber}
                type="number"
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
            <FormField
              control={studentForm.control}
              name="contact_numbers"
              render={() => (
                <FormItem>
                  {Array.isArray(
                    studentForm.formState.errors.contact_numbers
                  ) &&
                    studentForm.formState.errors.contact_numbers?.map(
                      (error, index) =>
                        error && (
                          <div
                            key={index}
                            className="text-sm font-medium text-destructive"
                          >
                            {`Contact #${index + 1}: ${error.message}`}
                          </div>
                        )
                    )}
                </FormItem>
              )}
            />
          </div>
        </div>

        <div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Father's Information</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={studentForm.control}
                name="father_name"
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
                name="father_job"
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
                name="father_education"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Education</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Bachelor's Degree" />
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
                control={studentForm.control}
                name="mother_name"
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
                name="mother_job"
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
                name="mother_education"
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
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={
              studentForm.formState.isLoading ||
              studentForm.formState.isSubmitting
            }
          >
            Continue to Fees & Discounts
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default StudentInfoForm;
