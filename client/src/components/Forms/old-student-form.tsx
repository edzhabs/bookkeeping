import { Button } from "@/components/ui/button";

import { StudentCombobox } from "@/components/student-combo-box";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CONSTANTS from "@/constants/constants";
import useStudentsQuery from "@/hooks/useStudentsQuery";
import oldEnrollmentSchema from "@/lib/validation/OldStudentEnrollment";
import { EnrollStudent } from "@/types/enrollment";
import { IGradeLevel, StudentDropdown } from "@/types/student";
import { formatDisplayGradeLevel } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ErrorComponent } from "../Errors/error";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";

interface Props {
  setActiveTab: (tab: string) => void;
  setEnrollmentData: (data: EnrollStudent) => void;
}

type FormValues = z.infer<typeof oldEnrollmentSchema>;

const OldStudentForm = ({ setEnrollmentData, setActiveTab }: Props) => {
  const { data: response, isLoading, isError } = useStudentsQuery();

  const existingStudents = response?.data;

  const studentForm = useForm<FormValues>({
    resolver: zodResolver(oldEnrollmentSchema),
    defaultValues: {
      studentID: "",
      grade_level: undefined,
      school_year: "",
    },
  });

  const [selectedStudent, setSelectedStudent] = useState<StudentDropdown>();

  const handleStudentChange = (studentId: string) => {
    const student = existingStudents?.find((s) => s.student_id === studentId);
    if (student) {
      studentForm.setValue("studentID", studentId);
      setSelectedStudent(student);
      studentForm.trigger("studentID");
      const nextGradeLevel = getNextGradeLevel(student.grade_level);
      studentForm.setValue("grade_level", nextGradeLevel);
      studentForm.trigger("grade_level");
    }
  };

  const getNextGradeLevel = (currentGradeLevel: IGradeLevel): IGradeLevel => {
    const currentIndex = CONSTANTS.GRADELEVELS.indexOf(currentGradeLevel);
    if (
      currentIndex === -1 ||
      currentIndex === CONSTANTS.GRADELEVELS.length - 1
    ) {
      return CONSTANTS.GRADELEVELS[currentIndex];
    }
    return CONSTANTS.GRADELEVELS[currentIndex + 1];
  };

  const checkSchoolYear = (inputSchoolYear: string) => {
    if (
      selectedStudent &&
      Number(inputSchoolYear.split("-")[0]) <
        Number(selectedStudent.school_year.split("-")[0])
    ) {
      studentForm.setError("school_year", {
        type: "manual",
        message: `School year cannot be before the student's current school year (${selectedStudent.school_year}).`,
      });
      return false;
    }
    return true;
  };

  const handleSubmit = (values: FormValues) => {
    if (!checkSchoolYear(values.school_year)) return;

    const enrollment: EnrollStudent = {
      student_id: values.studentID,
      student: {
        first_name: selectedStudent?.first_name || "",
        middle_name: selectedStudent?.middle_name || "",
        last_name: selectedStudent?.last_name || "",
        suffix: selectedStudent?.suffix || "",
      },
      grade_level: values.grade_level,
      school_year: values.school_year,
      type: "old",
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

  if (isError) return <ErrorComponent />;

  return (
    <Form {...studentForm}>
      <form onSubmit={studentForm.handleSubmit(handleSubmit)}>
        <div className="space-y-6">
          <FormField
            control={studentForm.control}
            name="studentID"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Student *</FormLabel>
                <FormControl>
                  <StudentCombobox
                    students={existingStudents}
                    selectedValue={field.value}
                    onValueChange={handleStudentChange}
                    isLoading={isLoading}
                  />
                </FormControl>
                <FormDescription>
                  Choose the student you want to enroll for the new school year.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedStudent && (
            <>
              <div className="rounded-lg border bg-muted/50 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Current Student Information</h3>
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Full Name
                    </p>
                    <p className="text-sm">
                      {selectedStudent.last_name}, {selectedStudent.first_name}{" "}
                      {selectedStudent.middle_name} {selectedStudent.suffix}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Current Grade Level
                    </p>
                    <p className="text-sm capitalize">
                      {selectedStudent.grade_level}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Current School Year
                    </p>
                    <p className="text-sm">{selectedStudent.school_year}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Address
                    </p>
                    <p className="text-sm">{selectedStudent.address}</p>
                  </div>
                </div>
              </div>

              <FormField
                control={studentForm.control}
                name="grade_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Grade Level *</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
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
                    <FormDescription>
                      Select the grade level for the upcoming school year.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={studentForm.control}
                name="school_year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New School Year *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., 2025-2026" />
                    </FormControl>

                    <FormDescription>
                      Input the school year for enrollment.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={
                isLoading ||
                studentForm.formState.isLoading ||
                studentForm.formState.isSubmitting
              }
            >
              Next: Fees & Tuition
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default OldStudentForm;
