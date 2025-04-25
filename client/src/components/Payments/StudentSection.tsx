import Student from "@/entities/student";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState, useRef } from "react";
import { FieldValues, Path, PathValue, UseFormReturn } from "react-hook-form";
import { Button } from "../ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import useStudents from "@/hooks/useStudents";

// Mock data for school years
const schoolYears = [
  { value: "2024-2025", label: "2024-2025" },
  { value: "2023-2024", label: "2023-2024" },
  { value: "2022-2023", label: "2022-2023" },
];

interface Props<T extends FieldValues = FieldValues> {
  form: UseFormReturn<T>;
}

const StudentSection = <T extends FieldValues>({ form }: Props<T>) => {
  const studentButtonRef = useRef<HTMLButtonElement>(null);
  const schoolYearButtonRef = useRef<HTMLButtonElement>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student>();
  const { data: students, isLoading, isError } = useStudents();

  const handleStudentSelect = (value: number) => {
    form.setValue("studentID" as Path<T>, value as PathValue<T, Path<T>>, {
      shouldValidate: true,
      shouldDirty: true,
    });
    const student = students?.data?.find((s) => s.id === value);
    setSelectedStudent(student);
  };
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* School Year Selection */}
        <FormField
          control={form.control}
          name={"schoolYear" as Path<T>}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>School Year</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      ref={schoolYearButtonRef}
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? schoolYears.find((year) => year.value === field.value)
                            ?.label
                        : "Select school year"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent
                  className="p-0 z-50 bg-white border border-gray-300 rounded-md shadow-md"
                  style={{
                    width: schoolYearButtonRef.current?.offsetWidth || "auto",
                  }}
                >
                  <Command className="bg-white">
                    <CommandInput placeholder="Search school year..." />
                    <CommandList>
                      <CommandEmpty>No school year found.</CommandEmpty>
                      <CommandGroup>
                        {schoolYears.map((year) => (
                          <CommandItem
                            key={year.value}
                            value={year.value}
                            onSelect={() => {
                              form.setValue(
                                "schoolYear" as Path<T>,
                                year.value as PathValue<T, Path<T>>,
                                {
                                  shouldValidate: true,
                                  shouldDirty: true,
                                }
                              );
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                year.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {year.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Student Selection */}
        {isError ? (
          "Error Encountered loading the students"
        ) : (
          <FormField
            control={form.control}
            name={"studentID" as Path<T>}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Name of Student</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        ref={studentButtonRef}
                        disabled={isLoading}
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {isLoading
                          ? "Loading student.."
                          : field.value
                          ? students?.data?.find(
                              (student) => student.id == field.value
                            )?.full_name
                          : "Select student"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent
                    className="p-0 z-50 bg-white border border-gray-300 rounded-md shadow-md"
                    style={{
                      width: studentButtonRef.current?.offsetWidth || "auto", // Match the button width
                    }}
                  >
                    <Command>
                      <CommandInput placeholder="Search student..." />
                      <CommandList>
                        <CommandEmpty>No student found.</CommandEmpty>
                        <CommandGroup>
                          {students?.data?.map((student) => (
                            <CommandItem
                              key={student.id}
                              value={student.id}
                              onSelect={() => handleStudentSelect(student.id)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  student.id == field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {student.full_name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
      {/* Student Details */}
      {/* TODO: ADD GRADE LEVEL AND DISCOUNT */}
      {selectedStudent && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-100 rounded-md">
          <div>
            <span className="text-sm font-medium">Grade Level:</span>
            <span className="ml-2">{"Grade 3"}</span>
          </div>
          <div>
            <span className="text-sm font-medium">Discount:</span>
            <span className="ml-2">{"10%"}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentSection;
