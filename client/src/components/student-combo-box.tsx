import * as React from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Student } from "@/types/student";

interface StudentComboboxProps {
  students: Student[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export function StudentCombobox({
  students,
  selectedValue,
  onValueChange,
  placeholder = "Select a student...",
}: StudentComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const selectedStudent = students.find(
    (student) => student.id === selectedValue
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedValue
            ? `${selectedStudent?.lastName}, ${selectedStudent?.firstName} ${
                selectedStudent?.middleName || ""
              } ${selectedStudent?.suffix || ""} (${
                selectedStudent?.gradeLevel
              })`
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command>
          <CommandInput
            placeholder="Search students..."
            className="flex-1 border-0 focus:ring-0"
          />
          <CommandList>
            <CommandEmpty>No student found.</CommandEmpty>
            <CommandGroup className="max-h-60 overflow-y-auto">
              {students.map((student) => (
                <CommandItem
                  key={student.id}
                  value={`${student.lastName} ${student.firstName} ${
                    student.middleName || ""
                  } ${student.suffix || ""} ${student.gradeLevel}`}
                  onSelect={() => {
                    onValueChange(student.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedValue === student.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span>
                      {student.lastName}, {student.firstName}{" "}
                      {student.middleName} {student.suffix}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {student.gradeLevel} ({student.schoolYear})
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
